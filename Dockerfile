FROM node:20-bookworm-slim AS deps
WORKDIR /app
# Pin npm so the version that validates the lockfile matches the one that
# generated it. Bump alongside packageManager in package.json and .nvmrc.
RUN npm install -g npm@11.6.2
COPY package.json package-lock.json* ./
RUN if [ -f package-lock.json ]; then npm ci --legacy-peer-deps; else npm install --legacy-peer-deps; fi

# ── Production build stage ───────────────────────────────────────────────────
FROM node:20-bookworm-slim AS builder
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build-time env (inlined into client JS). Landing has no backend deps —
# no Supabase, no Django API base. Just canonical origin + CTA target.
ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_APP_ORIGIN
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_APP_ORIGIN=$NEXT_PUBLIC_APP_ORIGIN

RUN npm run build

# ── Production runner stage ──────────────────────────────────────────────────
FROM node:20-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy standalone server output plus static assets and public/. Unlike the
# dashboard Dockerfile (which leaves the public/ copy to CI orchestration),
# we bake it into the image so the container is self-sufficient.
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
