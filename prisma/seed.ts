import 'dotenv/config';
import {
  PrismaClient,
  TransactionType,
  RecurringType,
  Frequency,
  CategoryType,
} from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Seeding database...');

  // ─── COLORS ───────────────────────────────────────────────────────────────
  await prisma.color.createMany({
    data: [
      { hexCode: '#EF4444' },
      { hexCode: '#DC2626' },
      { hexCode: '#B91C1C' },
      { hexCode: '#F97316' },
      { hexCode: '#EA580C' },
      { hexCode: '#EAB308' },
      { hexCode: '#F59E0B' },
      { hexCode: '#D97706' },
      { hexCode: '#22C55E' },
      { hexCode: '#16A34A' },
      { hexCode: '#10B981' },
      { hexCode: '#059669' },
      { hexCode: '#14B8A6' },
      { hexCode: '#0D9488' },
      { hexCode: '#06B6D4' },
      { hexCode: '#3B82F6' },
      { hexCode: '#2563EB' },
      { hexCode: '#1D4ED8' },
      { hexCode: '#0EA5E9' },
      { hexCode: '#0284C7' },
      { hexCode: '#8B5CF6' },
      { hexCode: '#7C3AED' },
      { hexCode: '#6D28D9' },
      { hexCode: '#4F46E5' },
      { hexCode: '#EC4899' },
      { hexCode: '#DB2777' },
      { hexCode: '#D946EF' },
      { hexCode: '#6B7280' },
      { hexCode: '#4B5563' },
      { hexCode: '#374151' },
      { hexCode: '#78716C' },
      { hexCode: '#57534E' },
    ],
    skipDuplicates: true,
  });
  console.log('✅ Colors seeded (32)');

  // ─── CATEGORY ICONS ───────────────────────────────────────────────────────
  await prisma.categoryIcon.createMany({
    data: [
      { iconName: 'shopping-cart-outline' },
      { iconName: 'home-outline' },
      { iconName: 'car-outline' },
      { iconName: 'flash-outline' },
      { iconName: 'phone-outline' },
      { iconName: 'wifi-outline' },
      { iconName: 'shopping-bag-outline' },
      { iconName: 'heart-outline' },
      { iconName: 'activity-outline' },
      { iconName: 'film-outline' },
      { iconName: 'music-outline' },
      { iconName: 'book-outline' },
      { iconName: 'credit-card-outline' },
      { iconName: 'trending-up-outline' },
      { iconName: 'pie-chart-outline' },
      { iconName: 'shield-outline' },
      { iconName: 'briefcase-outline' },
      { iconName: 'compass-outline' },
      { iconName: 'gift-outline' },
      { iconName: 'people-outline' },
      { iconName: 'file-text-outline' },
      { iconName: 'arrow-circle-down-outline' },
      { iconName: 'layers-outline' },
      { iconName: 'more-horizontal-outline' },
    ],
    skipDuplicates: true,
  });
  console.log('✅ Category icons seeded (24)');

  // ─── BANK TYPES ────────────────────────────────────────────────────────────
  const rawGH =
    'https://raw.githubusercontent.com/datatrans/payment-logos/master/assets/cards';
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

  // ─── USER ──────────────────────────────────────────────────────────────────
  const existingUser = await prisma.user.findFirst({
    where: { email: 'test@test.com' },
  });

  if (existingUser) {
    console.log('ℹ️  User already exists, skipping user+data seed');
    console.log('\n🎉 Database seeded successfully!');
    return;
  }

  const hashedPassword = await bcrypt.hash('Password123!', 10);

  const user = await prisma.user.create({
    data: {
      email: 'test@test.com',
      password: hashedPassword,
      name: 'Manuel',
      surname: 'Test',
      acceptedTerms: true,
    },
  });

  console.log(`✅ User created: ${user.email}`);

  // ─── CATEGORIES ────────────────────────────────────────────────────────────
  const allColors = await prisma.color.findMany({ orderBy: { id: 'asc' } });
  const allIcons = await prisma.categoryIcon.findMany({
    orderBy: { id: 'asc' },
  });

  const expenseCategories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Spesa',
        type: CategoryType.EXPENSE,
        userId: user.id,
        colorId: allColors[0].id,
        iconId: allIcons[0].id,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Trasporti',
        type: CategoryType.EXPENSE,
        userId: user.id,
        colorId: allColors[3].id,
        iconId: allIcons[2].id,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Casa',
        type: CategoryType.EXPENSE,
        userId: user.id,
        colorId: allColors[15].id,
        iconId: allIcons[1].id,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Ristoranti',
        type: CategoryType.EXPENSE,
        userId: user.id,
        colorId: allColors[8].id,
        iconId: allIcons[7].id,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Abbonamenti',
        type: CategoryType.EXPENSE,
        userId: user.id,
        colorId: allColors[20].id,
        iconId: allIcons[12].id,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Salute',
        type: CategoryType.EXPENSE,
        userId: user.id,
        colorId: allColors[11].id,
        iconId: allIcons[8].id,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Svago',
        type: CategoryType.EXPENSE,
        userId: user.id,
        colorId: allColors[24].id,
        iconId: allIcons[9].id,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Altro',
        type: CategoryType.EXPENSE,
        userId: user.id,
        colorId: allColors[27].id,
        iconId: allIcons[23].id,
      },
    }),
  ]);

  const incomeCategories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Stipendio',
        type: CategoryType.INCOME,
        userId: user.id,
        colorId: allColors[9].id,
        iconId: allIcons[16].id,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Freelance',
        type: CategoryType.INCOME,
        userId: user.id,
        colorId: allColors[6].id,
        iconId: allIcons[22].id,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Investimenti',
        type: CategoryType.INCOME,
        userId: user.id,
        colorId: allColors[13].id,
        iconId: allIcons[13].id,
      },
    }),
  ]);

  console.log(
    `✅ Categories created: ${expenseCategories.length + incomeCategories.length}`,
  );

  // ─── BANK ACCOUNTS ─────────────────────────────────────────────────────────
  const allBankTypes = await prisma.bankType.findMany({
    orderBy: { id: 'asc' },
  });
  const allBankAccountTypes = await prisma.bankAccountType.findMany({
    orderBy: { id: 'asc' },
  });

  const mainAccount = await prisma.bankAccount.create({
    data: {
      name: 'Conto N26',
      startingBalance: 3500.0,
      userId: user.id,
      colorId: allColors[15].id,
      bankTypeId: allBankTypes[0].id,
      bankAccountTypeId: allBankAccountTypes[0].id,
    },
  });

  const savingsAccount = await prisma.bankAccount.create({
    data: {
      name: 'Conto Risparmio',
      startingBalance: 10000.0,
      userId: user.id,
      colorId: allColors[8].id,
      bankTypeId: allBankTypes[1].id,
      bankAccountTypeId: allBankAccountTypes[1].id,
    },
  });

  console.log('✅ Bank accounts created: 2');

  // ─── CARD ACCOUNTS ─────────────────────────────────────────────────────────
  const allCardTypes = await prisma.cardType.findMany({
    orderBy: { id: 'asc' },
  });

  await prisma.cardAccount.create({
    data: {
      name: 'Visa N26',
      cardLimit: 5000.0,
      monthExpiry: 12,
      yearExpiry: 2028,
      userId: user.id,
      bankAccountId: mainAccount.id,
      cardTypeId: allCardTypes[0].id,
    },
  });

  console.log('✅ Card accounts created: 1');

  // ─── RECURRING RULES ───────────────────────────────────────────────────────
  const netflixRule = await prisma.recurringRule.create({
    data: {
      description: 'Netflix',
      amount: 15.99,
      type: RecurringType.EXPENSE,
      frequency: Frequency.MONTHLY,
      startDate: new Date('2026-01-01'),
      note: '',
      isActive: true,
      userId: user.id,
      categoryId: expenseCategories[4].id,
      bankAccountId: mainAccount.id,
    },
  });

  const spotifyRule = await prisma.recurringRule.create({
    data: {
      description: 'Spotify',
      amount: 9.99,
      type: RecurringType.EXPENSE,
      frequency: Frequency.MONTHLY,
      startDate: new Date('2026-01-01'),
      note: '',
      isActive: true,
      userId: user.id,
      categoryId: expenseCategories[4].id,
      bankAccountId: mainAccount.id,
    },
  });

  const salaryRule = await prisma.recurringRule.create({
    data: {
      description: 'Stipendio',
      amount: 2500.0,
      type: RecurringType.INCOME,
      frequency: Frequency.MONTHLY,
      startDate: new Date('2026-01-01'),
      note: '',
      isActive: true,
      userId: user.id,
      categoryId: incomeCategories[0].id,
      bankAccountId: mainAccount.id,
    },
  });

  console.log('✅ Recurring rules created: 3');

  // ─── TRANSACTIONS ──────────────────────────────────────────────────────────
  await Promise.all([
    prisma.transaction.create({
      data: {
        amount: 2500.0,
        date: new Date('2026-03-31'),
        description: 'Stipendio Marzo',
        recurrent: true,
        note: '',
        type: TransactionType.INCOME,
        userId: user.id,
        categoryId: incomeCategories[0].id,
        bankAccountId: mainAccount.id,
        recurringRuleId: salaryRule.id,
      },
    }),
    prisma.transaction.create({
      data: {
        amount: 800.0,
        date: new Date('2026-03-15'),
        description: 'Progetto freelance',
        recurrent: false,
        note: 'Cliente XYZ',
        type: TransactionType.INCOME,
        userId: user.id,
        categoryId: incomeCategories[1].id,
        bankAccountId: mainAccount.id,
      },
    }),
    prisma.transaction.create({
      data: {
        amount: 85.5,
        date: new Date('2026-03-28'),
        description: 'Spesa Esselunga',
        recurrent: false,
        note: '',
        type: TransactionType.EXPENSE,
        userId: user.id,
        categoryId: expenseCategories[0].id,
        bankAccountId: mainAccount.id,
      },
    }),
    prisma.transaction.create({
      data: {
        amount: 15.99,
        date: new Date('2026-03-01'),
        description: 'Netflix',
        recurrent: true,
        note: '',
        type: TransactionType.EXPENSE,
        userId: user.id,
        categoryId: expenseCategories[4].id,
        bankAccountId: mainAccount.id,
        recurringRuleId: netflixRule.id,
      },
    }),
    prisma.transaction.create({
      data: {
        amount: 9.99,
        date: new Date('2026-03-01'),
        description: 'Spotify',
        recurrent: true,
        note: '',
        type: TransactionType.EXPENSE,
        userId: user.id,
        categoryId: expenseCategories[4].id,
        bankAccountId: mainAccount.id,
        recurringRuleId: spotifyRule.id,
      },
    }),
    prisma.transaction.create({
      data: {
        amount: 45.0,
        date: new Date('2026-03-20'),
        description: 'Benzina',
        recurrent: false,
        note: '',
        type: TransactionType.EXPENSE,
        userId: user.id,
        categoryId: expenseCategories[1].id,
        bankAccountId: mainAccount.id,
      },
    }),
    prisma.transaction.create({
      data: {
        amount: 32.5,
        date: new Date('2026-03-22'),
        description: 'Cena con amici',
        recurrent: false,
        note: 'Ristorante Da Mario',
        type: TransactionType.EXPENSE,
        userId: user.id,
        categoryId: expenseCategories[3].id,
        bankAccountId: mainAccount.id,
      },
    }),
    prisma.transaction.create({
      data: {
        amount: 120.0,
        date: new Date('2026-03-10'),
        description: 'Bolletta luce',
        recurrent: false,
        note: '',
        type: TransactionType.EXPENSE,
        userId: user.id,
        categoryId: expenseCategories[2].id,
        bankAccountId: mainAccount.id,
      },
    }),
  ]);

  // ─── TRANSFER ──────────────────────────────────────────────────────────────
  const transferDetail = await prisma.transferDetail.create({
    data: {
      fromAccountId: mainAccount.id,
      toAccountId: savingsAccount.id,
    },
  });

  await prisma.transaction.createMany({
    data: [
      {
        amount: 500.0,
        date: new Date('2026-03-25'),
        description: 'Trasferimento risparmio',
        recurrent: false,
        note: '',
        type: TransactionType.TRANSFER,
        userId: user.id,
        bankAccountId: mainAccount.id,
        transferDetailId: transferDetail.id,
      },
      {
        amount: 500.0,
        date: new Date('2026-03-25'),
        description: 'Trasferimento risparmio',
        recurrent: false,
        note: '',
        type: TransactionType.TRANSFER,
        userId: user.id,
        bankAccountId: savingsAccount.id,
        transferDetailId: transferDetail.id,
      },
    ],
  });

  console.log('✅ Transactions created: 10');
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
