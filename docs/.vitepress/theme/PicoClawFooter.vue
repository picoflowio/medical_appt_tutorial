<template>
  <div class="picoclaw-footer">
    <img src="/picoclaw.png" alt="picoClaw" class="picoclaw-footer__logo" />
    <span>Intelligently created by <strong>picoClaw</strong></span>
  </div>
</template>

<style>
.picoclaw-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.8rem;
  margin-bottom: 1.5rem;
  border-radius: 999px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  font-size: 0.8rem;
  color: var(--vp-c-text-2);
}

.picoclaw-badge img {
  height: 20px;
  width: auto;
}

.picoclaw-badge strong {
  color: var(--vp-c-brand-1);
}
</style>

<style scoped>
.picoclaw-footer {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 2.5rem;
  padding-top: 1rem;
  border-top: 1px solid var(--vp-c-divider);
  font-size: 0.8rem;
  color: var(--vp-c-text-3);
  opacity: 0.8;
}

.picoclaw-footer__logo {
  height: 24px;
  width: auto;
}

.picoclaw-footer strong {
  color: var(--vp-c-text-2);
}
</style>
