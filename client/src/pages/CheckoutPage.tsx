import { useMemo, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  selectCartItems,
  selectCartSubtotal,
} from '@/features/cart/cartSlice';
import { clearCartSmart } from '@/features/cart/cartCommerce';
import { addOrder } from '@/features/orders/ordersSlice';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { EmptyState } from '@/components/ui/EmptyState';
import { ordersApi, couponsApi } from '@/services/apiClient';
import type { AppDispatch, RootState } from '@/store';
import { store } from '@/store';
import { Seo } from '@/components/seo/Seo';

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

/** SECTION 07 — Checkout: auth-required real orders, correct coupons, empty state */
export function CheckoutPage() {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const items = useSelector(selectCartItems);
  const subtotal = useSelector(selectCartSubtotal);
  const isAuthenticated = useSelector((s: RootState) => s.auth.isAuthenticated);
  const user = useSelector((s: RootState) => s.auth.user);
  const isAr = i18n.language === 'ar';

  const [couponError, setCouponError] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [appliedCode, setAppliedCode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const defaultValues = useMemo(
    () => ({
      shippingMethod: 'standard' as const,
      name: user?.name || '',
      email: user?.email || '',
    }),
    [user?.name, user?.email]
  );

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const shippingMethod = watch('shippingMethod');
  const shipping = SHIPPING_PRICES[shippingMethod] ?? 15;
  const total = Math.max(0, subtotal + shipping - discountAmount);

  const applyCoupon = async () => {
    const code = (watch('coupon') || '').trim().toUpperCase();
    if (!code) {
      setCouponError('');
      setDiscountAmount(0);
      setAppliedCode('');
      return;
    }
    try {
      const res = await couponsApi.validate(code);
      const data = res.data as {
        discountType?: string;
        discountValue?: number;
        code?: string;
      };
      if (data?.discountType === 'percentage' && data.discountValue != null) {
        const amt = Math.min(subtotal, (subtotal * data.discountValue) / 100);
        setDiscountAmount(amt);
        setAppliedCode(data.code || code);
        setCouponError('');
      } else if (data?.discountType === 'fixed' && data.discountValue != null) {
        setDiscountAmount(Math.min(subtotal, data.discountValue));
        setAppliedCode(data.code || code);
        setCouponError('');
      } else {
        setDiscountAmount(0);
        setAppliedCode('');
        setCouponError(t('checkout.invalidCoupon'));
      }
    } catch {
      setDiscountAmount(0);
      setAppliedCode('');
      setCouponError(t('checkout.invalidCoupon'));
    }
  };

  const onSubmit = async (data: FormData) => {
    if (items.length === 0) return;
    setSubmitError('');

    if (!isAuthenticated) {
      setSubmitError(
        t('checkout.loginRequired', {
          defaultValue: 'Please sign in to place your order.',
        })
      );
      return;
    }

    setSubmitting(true);
    try {
      const res = await ordersApi.create({
        items: items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
          size: i.size,
          color: i.color,
        })),
        shippingAddress: {
          fullName: data.name,
          phone: data.phone,
          country: data.country,
          city: data.city,
          street: data.line1,
          apartment: data.line2 || undefined,
          postalCode: data.postalCode || undefined,
        },
        paymentMethod: 'cod',
        couponCode: appliedCode || undefined,
        shippingCost: shipping,
        customerEmail: data.email,
        customerPhone: data.phone,
      });
      const created = res.data as {
        _id?: string;
        orderNumber?: string;
        id?: string;
      };
      const oid = created.orderNumber || created._id || created.id || 'unknown';

      dispatch(
        addOrder({
          id: String(oid),
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
        })
      );

      void clearCartSmart(dispatch, store.getState);
      setSubmitting(false);
      navigate(`/order-confirmation/${oid}`);
    } catch (err) {
      setSubmitting(false);
      const msg =
        err instanceof Error
          ? err.message
          : t('checkout.orderFailed', { defaultValue: 'Order failed. Please try again.' });
      setSubmitError(msg);
    }
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <EmptyState
          title={t('checkout.emptyCart')}
          description={t('checkout.emptyCartDesc', {
            defaultValue: 'Add pieces from the shop before checking out.',
          })}
          actionLabel={t('cart.continueShopping')}
          actionTo="/shop"
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Seo title="Checkout" description="Complete your FIVE Fashion order." />
      <h1 className="font-display text-3xl font-semibold tracking-tight">{t('checkout.title')}</h1>

      {!isAuthenticated && (
        <div className="mt-6 rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm" role="status">
          <p className="text-foreground">
            {t('checkout.loginRequired', {
              defaultValue: 'Please sign in to place your order.',
            })}
          </p>
          <Link
            to={`/login?redirect=${encodeURIComponent('/checkout')}`}
            className="mt-1 inline-block font-medium text-primary underline-offset-2 hover:underline"
          >
            {t('auth.login', { defaultValue: 'Sign in' })}
          </Link>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="mt-10 grid gap-12 lg:grid-cols-5">
        <div className="space-y-10 lg:col-span-3">
          <section>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              {t('checkout.contact')}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label={t('auth.name')} error={errors.name?.message} {...register('name')} />
              <Input label={t('auth.email')} type="email" error={errors.email?.message} {...register('email')} />
              <Input label={t('checkout.phone')} error={errors.phone?.message} {...register('phone')} className="sm:col-span-2" />
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
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

          <section>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
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
                    <input type="radio" value={method} {...register('shippingMethod')} className="accent-accent" />
                    <div>
                      <p className="text-sm font-medium">{t(`checkout.${method}`)}</p>
                      <p className="text-xs text-muted-foreground">{t(`checkout.${method}Desc`)}</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium">${SHIPPING_PRICES[method]}</span>
                </label>
              ))}
            </div>
          </section>
        </div>

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

            <div className="mt-6 flex gap-2">
              <Input placeholder={t('checkout.couponPlaceholder')} {...register('coupon')} className="flex-1" />
              <Button type="button" variant="outline" onClick={applyCoupon}>
                {t('checkout.apply')}
              </Button>
            </div>
            {couponError && <p className="mt-1 text-xs text-error">{couponError}</p>}
            {appliedCode && (
              <p className="mt-1 text-xs text-success">{t('checkout.couponApplied', { code: appliedCode })}</p>
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

            {submitError && (
              <p className="mt-4 text-sm text-error" role="alert">
                {submitError}
              </p>
            )}

            <Button type="submit" size="lg" fullWidth className="mt-6" isLoading={submitting}>
              {t('checkout.placeOrder')}
            </Button>
            <p className="mt-4 text-center text-xs text-muted-foreground">{t('checkout.paymentNote')}</p>
          </div>
        </div>
      </form>
    </div>
  );
}
