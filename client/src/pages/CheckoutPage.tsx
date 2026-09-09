import { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  selectCartItems,
  selectCartSubtotal,
  clearCart,
} from '@/features/cart/cartSlice';
import { addOrder } from '@/features/orders/ordersSlice';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { getCouponRate } from '@/utils/coupons';

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(6),
  line1: z.string().min(3),
  line2: z.string().optional(),
  city: z.string().min(2),
  country: z.string().min(2),
  postalCode: z.string().min(2),
  shippingMethod: z.enum(['standard', 'express']),
  coupon: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const SHIPPING_PRICES = { standard: 15, express: 35 };
export function CheckoutPage() {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const items = useSelector(selectCartItems);
  const subtotal = useSelector(selectCartSubtotal);
  const isAr = i18n.language === 'ar';

  const [couponError, setCouponError] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [appliedCode, setAppliedCode] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { shippingMethod: 'standard' },
  });

  const shippingMethod = watch('shippingMethod');
  const shipping = SHIPPING_PRICES[shippingMethod] ?? 15;
  const discountAmount = subtotal * appliedDiscount;
  const total = Math.max(0, subtotal + shipping - discountAmount);

  const applyCoupon = () => {
    const code = (watch('coupon') || '').trim().toUpperCase();
    if (!code) {
      setCouponError('');
      setAppliedDiscount(0);
      setAppliedCode('');
      return;
    }
    const rate = getCouponRate(code);
    if (rate) {
      setAppliedDiscount(rate);
      setAppliedCode(code);
      setCouponError('');
    } else {
      setAppliedDiscount(0);
      setAppliedCode('');
      setCouponError(t('checkout.invalidCoupon'));
    }
  };

  const onSubmit = async (data: FormData) => {
    if (items.length === 0) return;
    setSubmitting(true);

    const order = {
      id: `ORD-${Date.now().toString(36).toUpperCase()}`,
      items: items.map((i) => ({
        productId: i.productId,
        nameEn: i.nameEn,
        nameAr: i.nameAr,
        price: i.price,
        salePrice: i.salePrice,
        quantity: i.quantity,
        size: i.size,
        color: i.color,
      })),
      subtotal,
      shipping,
      discount: discountAmount,
      total,
      status: 'confirmed' as const,
      customer: {
        name: data.name,
        email: data.email,
        phone: data.phone,
      },
      address: {
        line1: data.line1,
        line2: data.line2,
        city: data.city,
        country: data.country,
        postalCode: data.postalCode,
      },
      shippingMethod: data.shippingMethod,
      couponCode: appliedCode || undefined,
      createdAt: new Date().toISOString(),
    };

    dispatch(addOrder(order));
    dispatch(clearCart());
    setSubmitting(false);
    navigate(`/order-confirmation/${order.id}`);
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center">
        <h1 className="font-display text-2xl font-semibold">{t('checkout.emptyCart')}</h1>
        <Link to="/shop" className="mt-6">
          <Button variant="outline">{t('cart.continueShopping')}</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-semibold tracking-tight">
        {t('checkout.title')}
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-10 grid gap-12 lg:grid-cols-5">
        {/* Left: forms */}
        <div className="space-y-10 lg:col-span-3">
          {/* Contact */}
          <section>
            <h2 className="mb-4 text-sm font-semibold tracking-wide uppercase text-muted-foreground">
              {t('checkout.contact')}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label={t('auth.name')} error={errors.name?.message} {...register('name')} />
              <Input label={t('auth.email')} type="email" error={errors.email?.message} {...register('email')} />
              <Input label={t('checkout.phone')} error={errors.phone?.message} {...register('phone')} className="sm:col-span-2" />
            </div>
          </section>

          {/* Address */}
          <section>
            <h2 className="mb-4 text-sm font-semibold tracking-wide uppercase text-muted-foreground">
              {t('checkout.shippingAddress')}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label={t('checkout.addressLine1')} error={errors.line1?.message} {...register('line1')} className="sm:col-span-2" />
              <Input label={t('checkout.addressLine2')} {...register('line2')} className="sm:col-span-2" />
              <Input label={t('checkout.city')} error={errors.city?.message} {...register('city')} />
              <Input label={t('checkout.postalCode')} error={errors.postalCode?.message} {...register('postalCode')} />
              <Input label={t('checkout.country')} error={errors.country?.message} {...register('country')} className="sm:col-span-2" />
            </div>
          </section>

          {/* Shipping method */}
          <section>
            <h2 className="mb-4 text-sm font-semibold tracking-wide uppercase text-muted-foreground">
              {t('checkout.shippingMethod')}
            </h2>
            <div className="space-y-3">
              {(['standard', 'express'] as const).map((method) => (
                <label
                  key={method}
                  className={`flex cursor-pointer items-center justify-between rounded-xl border px-4 py-3 transition-colors ${
                    shippingMethod === method
                      ? 'border-primary bg-muted'
                      : 'border-border hover:border-foreground/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      value={method}
                      {...register('shippingMethod')}
                      className="accent-accent"
                    />
                    <div>
                      <p className="text-sm font-medium">{t(`checkout.${method}`)}</p>
                      <p className="text-xs text-muted-foreground">
                        {t(`checkout.${method}Desc`)}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-medium">${SHIPPING_PRICES[method]}</span>
                </label>
              ))}
            </div>
          </section>
        </div>

        {/* Right: summary */}
        <div className="lg:col-span-2">
          <div className="sticky top-24 rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="font-display text-lg font-semibold">{t('checkout.orderSummary')}</h2>

            <ul className="mt-6 max-h-48 space-y-3 overflow-y-auto">
              {items.map((item) => (
                <li key={item.id} className="flex justify-between gap-3 text-sm">
                  <span className="line-clamp-1 text-muted-foreground">
                    {isAr ? item.nameAr : item.nameEn} × {item.quantity}
                  </span>
                  <span className="shrink-0 font-medium">
                    ${((item.salePrice ?? item.price) * item.quantity).toFixed(0)}
                  </span>
                </li>
              ))}
            </ul>

            {/* Coupon */}
            <div className="mt-6 flex gap-2">
              <Input
                placeholder={t('checkout.couponPlaceholder')}
                {...register('coupon')}
                className="flex-1"
              />
              <Button type="button" variant="outline" onClick={applyCoupon}>
                {t('checkout.apply')}
              </Button>
            </div>
            {couponError && <p className="mt-1 text-xs text-error">{couponError}</p>}
            {appliedCode && (
              <p className="mt-1 text-xs text-success">
                {t('checkout.couponApplied', { code: appliedCode })}
              </p>
            )}

            <div className="mt-6 space-y-2 border-t border-border pt-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('cart.subtotal')}</span>
                <span>${subtotal.toFixed(0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('checkout.shipping')}</span>
                <span>${shipping.toFixed(0)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-success">
                  <span>{t('checkout.discount')}</span>
                  <span>−${discountAmount.toFixed(0)}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-border pt-3 text-base font-semibold">
                <span>{t('checkout.total')}</span>
                <span>${total.toFixed(0)}</span>
              </div>
            </div>

            <Button type="submit" size="lg" fullWidth className="mt-6" isLoading={submitting}>
              {t('checkout.placeOrder')}
            </Button>

            <p className="mt-4 text-center text-xs text-muted-foreground">
              {t('checkout.paymentNote')}
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
