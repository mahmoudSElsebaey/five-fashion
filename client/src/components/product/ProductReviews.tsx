import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { reviewsApi } from '@/services/apiClient';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import type { RootState } from '@/store';

type ReviewRow = {
  _id: string;
  rating?: number;
  title?: string;
  comment?: string;
  createdAt?: string;
  user?: { name?: string };
};

/** SECTION 12 — Approved reviews list + create form when authenticated */
export function ProductReviews({ productId }: { productId: string }) {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const isAuthenticated = useSelector((s: RootState) => s.auth.isAuthenticated);
  const [rows, setRows] = useState<ReviewRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formOk, setFormOk] = useState<string | null>(null);

  const text = (en: string, ar: string) => (isAr ? ar : en);

  const load = useCallback(async () => {
    if (!productId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await reviewsApi.listForProduct(productId, 1);
      setRows((res.data as ReviewRow[]) || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : text('Failed to load reviews', 'تعذر تحميل التقييمات'));
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [productId, isAr]);

  useEffect(() => {
    void load();
  }, [load]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormOk(null);
    setSubmitting(true);
    try {
      await reviewsApi.create({
        productId,
        rating,
        title: title.trim() || undefined,
        comment: comment.trim() || undefined,
      });
      setFormOk(
        t('product.reviewPending', {
          defaultValue: text('Thanks — your review will appear after moderation.', 'شكرًا لك — سيظهر تقييمك بعد مراجعته.')
        })
      );
      setTitle('');
      setComment('');
      setRating(5);
      await load();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : text('Could not submit review', 'تعذر إرسال التقييم'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mt-16 border-t border-border pt-12" aria-labelledby="reviews-heading">
      <h2 id="reviews-heading" className="font-display text-2xl font-semibold tracking-tight">
        {t('admin.nav.reviews', { defaultValue: text('Reviews', 'التقييمات') })}
      </h2>

      {loading ? (
        <div className="flex justify-center py-12" role="status">
          <Spinner />
        </div>
      ) : error ? (
        <p className="mt-4 text-sm text-error" role="alert">
          {error}
        </p>
      ) : rows.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">
          {t('product.noReviews', { defaultValue: text('No reviews yet. Be the first.', 'لا توجد تقييمات حتى الآن. كن أول من يقيّم المنتج.') })}
        </p>
      ) : (
        <ul className="mt-6 space-y-4">
          {rows.map((r) => (
            <li key={r._id} className="rounded-xl border border-border bg-card p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-medium">
                  {r.user?.name || t('product.anonymous', { defaultValue: text('Customer', 'عميل') })}
                </p>
                <p className="text-sm text-accent" aria-label={`${r.rating} ${text('stars', 'نجوم')}`}>
                  {'★'.repeat(Math.min(5, Math.max(0, r.rating || 0)))}
                  <span className="text-muted-foreground">
                    {'☆'.repeat(5 - Math.min(5, Math.max(0, r.rating || 0)))}
                  </span>
                </p>
              </div>
              {r.title && <p className="mt-1 text-sm font-medium">{r.title}</p>}
              {r.comment && <p className="mt-2 text-sm text-muted-foreground">{r.comment}</p>}
              {r.createdAt && (
                <p className="mt-2 text-xs text-muted-foreground">
                  {new Date(r.createdAt).toLocaleDateString(i18n.language, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-10">
        <h3 className="text-sm font-semibold tracking-wide">
          {t('product.writeReview', { defaultValue: text('Write a review', 'اكتب تقييمًا') })}
        </h3>
        {!isAuthenticated ? (
          <p className="mt-3 text-sm text-muted-foreground">
            <Link to="/login" className="underline hover:text-foreground">
              {t('auth.login', { defaultValue: text('Log in', 'تسجيل الدخول') })}
            </Link>{' '}
            {t('product.reviewLoginHint', { defaultValue: text('to leave a review.', 'لإضافة تقييم.') })}
          </p>
        ) : (
          <form onSubmit={submit} className="mt-4 max-w-lg space-y-3">
            <label className="block text-sm">
              <span className="text-muted-foreground">
                {t('product.rating', { defaultValue: text('Rating', 'التقييم') })}
              </span>
              <select
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2"
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
              >
                {[5, 4, 3, 2, 1].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm">
              <span className="text-muted-foreground">
                {t('product.reviewTitle', { defaultValue: text('Title (optional)', 'العنوان (اختياري)') })}
              </span>
              <input
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={120}
              />
            </label>
            <label className="block text-sm">
              <span className="text-muted-foreground">
                {t('product.reviewComment', { defaultValue: text('Comment (optional)', 'التعليق (اختياري)') })}
              </span>
              <textarea
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2"
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                maxLength={2000}
              />
            </label>
            {formError && (
              <p className="text-sm text-error" role="alert">
                {formError}
              </p>
            )}
            {formOk && (
              <p className="text-sm text-success" role="status">
                {formOk}
              </p>
            )}
            <Button type="submit" disabled={submitting} isLoading={submitting}>
              {t('product.submitReview', { defaultValue: text('Submit review', 'إرسال التقييم') })}
            </Button>
          </form>
        )}
      </div>
    </section>
  );
}
