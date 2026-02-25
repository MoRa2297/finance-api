import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Seeding database...');

  // ─── COLORS ───────────────────────────────────────────────────────────────
  await prisma.color.createMany({
    data: [
      // Rossi
      { hexCode: '#EF4444' },
      { hexCode: '#DC2626' },
      { hexCode: '#B91C1C' },
      // Arancioni
      { hexCode: '#F97316' },
      { hexCode: '#EA580C' },
      // Gialli / Ambra
      { hexCode: '#EAB308' },
      { hexCode: '#F59E0B' },
      { hexCode: '#D97706' },
      // Verdi
      { hexCode: '#22C55E' },
      { hexCode: '#16A34A' },
      { hexCode: '#10B981' },
      { hexCode: '#059669' },
      // Teal / Ciano
      { hexCode: '#14B8A6' },
      { hexCode: '#0D9488' },
      { hexCode: '#06B6D4' },
      // Blu
      { hexCode: '#3B82F6' },
      { hexCode: '#2563EB' },
      { hexCode: '#1D4ED8' },
      { hexCode: '#0EA5E9' },
      { hexCode: '#0284C7' },
      // Viola / Indaco
      { hexCode: '#8B5CF6' },
      { hexCode: '#7C3AED' },
      { hexCode: '#6D28D9' },
      { hexCode: '#4F46E5' },
      // Rosa / Fuchsia
      { hexCode: '#EC4899' },
      { hexCode: '#DB2777' },
      { hexCode: '#D946EF' },
      // Grigi
      { hexCode: '#6B7280' },
      { hexCode: '#4B5563' },
      { hexCode: '#374151' },
      // Neutri caldi
      { hexCode: '#78716C' },
      { hexCode: '#57534E' },
    ],
    skipDuplicates: true,
  });
  console.log('✅ Colors seeded (32)');

  // ─── CATEGORY ICONS (Eva Icons) ───────────────────────────────────────────────
  await prisma.categoryIcon.createMany({
    data: [
      // Expenses
      { iconName: 'shopping-cart-outline' },
      { iconName: 'home-outline' },
      { iconName: 'car-outline' },
      { iconName: 'flash-outline' },
      { iconName: 'phone-outline' },
      { iconName: 'wifi-outline' },
      // Lifestyle
      { iconName: 'shopping-bag-outline' },
      { iconName: 'heart-outline' },
      { iconName: 'activity-outline' },
      { iconName: 'film-outline' },
      { iconName: 'music-outline' },
      { iconName: 'book-outline' },
      // Finance
      { iconName: 'credit-card-outline' },
      { iconName: 'trending-up-outline' },
      { iconName: 'pie-chart-outline' },
      { iconName: 'shield-outline' },
      // Other
      { iconName: 'briefcase-outline' },
      { iconName: 'compass-outline' },
      { iconName: 'gift-outline' },
      { iconName: 'people-outline' },
      { iconName: 'file-text-outline' },
      // Income
      { iconName: 'arrow-circle-down-outline' },
      { iconName: 'layers-outline' },
      // Misc
      { iconName: 'more-horizontal-outline' },
    ],
    skipDuplicates: true,
  });
  console.log('✅ Category icons seeded (24)');

  // ─── BANK TYPES ────────────────────────────────────────────────────────────
  await prisma.bankType.createMany({
    data: [
      { name: 'N26', imageUrl: 'https://logo.clearbit.com/n26.com' },
      { name: 'Revolut', imageUrl: 'https://logo.clearbit.com/revolut.com' },
      { name: 'Wise', imageUrl: 'https://logo.clearbit.com/wise.com' },
      { name: 'Monzo', imageUrl: 'https://logo.clearbit.com/monzo.com' },
      { name: 'Bunq', imageUrl: 'https://logo.clearbit.com/bunq.com' },
      {
        name: 'Intesa Sanpaolo',
        imageUrl: 'https://logo.clearbit.com/intesasanpaolo.com',
      },
      { name: 'UniCredit', imageUrl: 'https://logo.clearbit.com/unicredit.it' },
      { name: 'Fineco', imageUrl: 'https://logo.clearbit.com/finecobank.com' },
      {
        name: 'Mediolanum',
        imageUrl: 'https://logo.clearbit.com/bancamediolanum.it',
      },
      { name: 'BNL', imageUrl: 'https://logo.clearbit.com/bnl.it' },
      {
        name: 'Monte dei Paschi',
        imageUrl: 'https://logo.clearbit.com/mps.it',
      },
      { name: 'Banco BPM', imageUrl: 'https://logo.clearbit.com/bancobpm.it' },
      { name: 'BPER Banca', imageUrl: 'https://logo.clearbit.com/bper.it' },
      { name: 'Credem', imageUrl: 'https://logo.clearbit.com/credem.it' },
      { name: 'ING', imageUrl: 'https://logo.clearbit.com/ing.com' },
      { name: 'Deutsche Bank', imageUrl: 'https://logo.clearbit.com/db.com' },
      { name: 'HSBC', imageUrl: 'https://logo.clearbit.com/hsbc.com' },
      { name: 'Altro', imageUrl: '' },
    ],
    skipDuplicates: true,
  });
  console.log('✅ Bank types seeded (18)');

  // ─── BANK ACCOUNT TYPES ────────────────────────────────────────────────────
  await prisma.bankAccountType.createMany({
    data: [
      { name: 'checking' },
      { name: 'savings' },
      { name: 'deposit' },
      { name: 'investment' },
      { name: 'business' },
      { name: 'youth' },
      { name: 'online' },
    ],
    skipDuplicates: true,
  });
  console.log('✅ Bank account types seeded (7)');

  // ─── CARD TYPES ────────────────────────────────────────────────────────────
  const rawGH =
    'https://raw.githubusercontent.com/datatrans/payment-logos/master/assets/cards';
  await prisma.cardType.createMany({
    data: [
      { name: 'Visa', imageUrl: `${rawGH}/visa.svg` },
      { name: 'Mastercard', imageUrl: `${rawGH}/mastercard.svg` },
      { name: 'American Express', imageUrl: `${rawGH}/american-express.svg` },
      { name: 'Maestro', imageUrl: `${rawGH}/maestro.svg` },
      { name: 'Discover', imageUrl: `${rawGH}/discover.svg` },
      { name: 'JCB', imageUrl: `${rawGH}/jcb.svg` },
      { name: 'Diners Club', imageUrl: `${rawGH}/diners.svg` },
      { name: 'UnionPay', imageUrl: `${rawGH}/unionpay.svg` },
      { name: 'Prepagata', imageUrl: '' },
      { name: 'Bancomat', imageUrl: '' },
    ],
    skipDuplicates: true,
  });
  console.log('✅ Card types seeded (10)');

  console.log('\n🎉 Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
