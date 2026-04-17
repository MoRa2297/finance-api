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
      { iconName: 'activity-outline' },
      { iconName: 'alert-circle-outline' },
      { iconName: 'alert-triangle-outline' },
      { iconName: 'archive-outline' },
      { iconName: 'arrow-back-outline' },
      { iconName: 'arrow-circle-down-outline' },
      { iconName: 'arrow-circle-left-outline' },
      { iconName: 'arrow-circle-right-outline' },
      { iconName: 'arrow-circle-up-outline' },
      { iconName: 'arrow-down-outline' },
      { iconName: 'arrow-downward-outline' },
      { iconName: 'arrow-forward-outline' },
      { iconName: 'arrow-ios-back-outline' },
      { iconName: 'arrow-ios-downward-outline' },
      { iconName: 'arrow-ios-forward-outline' },
      { iconName: 'arrow-ios-upward-outline' },
      { iconName: 'arrow-left-outline' },
      { iconName: 'arrow-right-outline' },
      { iconName: 'arrow-up-outline' },
      { iconName: 'arrow-upward-outline' },
      { iconName: 'arrowhead-down-outline' },
      { iconName: 'arrowhead-left-outline' },
      { iconName: 'arrowhead-right-outline' },
      { iconName: 'arrowhead-up-outline' },
      { iconName: 'at-outline' },
      { iconName: 'attach-outline' },
      { iconName: 'attach-2-outline' },
      { iconName: 'award-outline' },
      { iconName: 'backspace-outline' },
      { iconName: 'bar-chart-outline' },
      { iconName: 'bar-chart-2-outline' },
      { iconName: 'battery-outline' },
      { iconName: 'behance-outline' },
      { iconName: 'bell-outline' },
      { iconName: 'bell-off-outline' },
      { iconName: 'bluetooth-outline' },
      { iconName: 'book-outline' },
      { iconName: 'book-open-outline' },
      { iconName: 'bookmark-outline' },
      { iconName: 'briefcase-outline' },
      { iconName: 'browser-outline' },
      { iconName: 'brush-outline' },
      { iconName: 'bulb-outline' },
      { iconName: 'calendar-outline' },
      { iconName: 'camera-outline' },
      { iconName: 'car-outline' },
      { iconName: 'cast-outline' },
      { iconName: 'charging-outline' },
      { iconName: 'checkmark-outline' },
      { iconName: 'checkmark-circle-outline' },
      { iconName: 'checkmark-circle-2-outline' },
      { iconName: 'checkmark-square-outline' },
      { iconName: 'checkmark-square-2-outline' },
      { iconName: 'chevron-down-outline' },
      { iconName: 'chevron-left-outline' },
      { iconName: 'chevron-right-outline' },
      { iconName: 'chevron-up-outline' },
      { iconName: 'clipboard-outline' },
      { iconName: 'clock-outline' },
      { iconName: 'close-outline' },
      { iconName: 'close-circle-outline' },
      { iconName: 'close-square-outline' },
      { iconName: 'cloud-download-outline' },
      { iconName: 'cloud-upload-outline' },
      { iconName: 'code-outline' },
      { iconName: 'code-download-outline' },
      { iconName: 'collapse-outline' },
      { iconName: 'color-palette-outline' },
      { iconName: 'color-picker-outline' },
      { iconName: 'compass-outline' },
      { iconName: 'copy-outline' },
      { iconName: 'corner-down-left-outline' },
      { iconName: 'corner-down-right-outline' },
      { iconName: 'corner-left-down-outline' },
      { iconName: 'corner-left-up-outline' },
      { iconName: 'corner-right-down-outline' },
      { iconName: 'corner-right-up-outline' },
      { iconName: 'corner-up-left-outline' },
      { iconName: 'corner-up-right-outline' },
      { iconName: 'credit-card-outline' },
      { iconName: 'crop-outline' },
      { iconName: 'cube-outline' },
      { iconName: 'diagonal-arrow-left-down-outline' },
      { iconName: 'diagonal-arrow-left-up-outline' },
      { iconName: 'diagonal-arrow-right-down-outline' },
      { iconName: 'diagonal-arrow-right-up-outline' },
      { iconName: 'done-all-outline' },
      { iconName: 'download-outline' },
      { iconName: 'droplet-outline' },
      { iconName: 'droplet-off-outline' },
      { iconName: 'edit-outline' },
      { iconName: 'edit-2-outline' },
      { iconName: 'email-outline' },
      { iconName: 'expand-outline' },
      { iconName: 'external-link-outline' },
      { iconName: 'eye-outline' },
      { iconName: 'eye-off-outline' },
      { iconName: 'eye-off-2-outline' },
      { iconName: 'facebook-outline' },
      { iconName: 'file-outline' },
      { iconName: 'file-add-outline' },
      { iconName: 'file-remove-outline' },
      { iconName: 'file-text-outline' },
      { iconName: 'film-outline' },
      { iconName: 'flag-outline' },
      { iconName: 'flash-outline' },
      { iconName: 'flash-off-outline' },
      { iconName: 'flip-outline' },
      { iconName: 'flip-2-outline' },
      { iconName: 'folder-outline' },
      { iconName: 'folder-add-outline' },
      { iconName: 'folder-remove-outline' },
      { iconName: 'funnel-outline' },
      { iconName: 'gift-outline' },
      { iconName: 'github-outline' },
      { iconName: 'globe-outline' },
      { iconName: 'globe-2-outline' },
      { iconName: 'google-outline' },
      { iconName: 'grid-outline' },
      { iconName: 'hard-drive-outline' },
      { iconName: 'hash-outline' },
      { iconName: 'headphones-outline' },
      { iconName: 'heart-outline' },
      { iconName: 'home-outline' },
      { iconName: 'image-outline' },
      { iconName: 'inbox-outline' },
      { iconName: 'info-outline' },
      { iconName: 'keypad-outline' },
      { iconName: 'layers-outline' },
      { iconName: 'layout-outline' },
      { iconName: 'link-outline' },
      { iconName: 'link-2-outline' },
      { iconName: 'linkedin-outline' },
      { iconName: 'list-outline' },
      { iconName: 'loader-outline' },
      { iconName: 'lock-outline' },
      { iconName: 'log-in-outline' },
      { iconName: 'log-out-outline' },
      { iconName: 'map-outline' },
      { iconName: 'maximize-outline' },
      { iconName: 'menu-outline' },
      { iconName: 'menu-arrow-outline' },
      { iconName: 'menu-2-outline' },
      { iconName: 'message-circle-outline' },
      { iconName: 'message-square-outline' },
      { iconName: 'mic-outline' },
      { iconName: 'mic-off-outline' },
      { iconName: 'minimize-outline' },
      { iconName: 'minus-outline' },
      { iconName: 'minus-circle-outline' },
      { iconName: 'minus-square-outline' },
      { iconName: 'monitor-outline' },
      { iconName: 'moon-outline' },
      { iconName: 'more-horizontal-outline' },
      { iconName: 'more-vertical-outline' },
      { iconName: 'move-outline' },
      { iconName: 'music-outline' },
      { iconName: 'navigation-outline' },
      { iconName: 'navigation-2-outline' },
      { iconName: 'npm-outline' },
      { iconName: 'options-outline' },
      { iconName: 'options-2-outline' },
      { iconName: 'pantone-outline' },
      { iconName: 'paper-plane-outline' },
      { iconName: 'pause-circle-outline' },
      { iconName: 'people-outline' },
      { iconName: 'percent-outline' },
      { iconName: 'person-outline' },
      { iconName: 'person-add-outline' },
      { iconName: 'person-delete-outline' },
      { iconName: 'person-done-outline' },
      { iconName: 'person-remove-outline' },
      { iconName: 'phone-outline' },
      { iconName: 'phone-call-outline' },
      { iconName: 'phone-missed-outline' },
      { iconName: 'phone-off-outline' },
      { iconName: 'pie-chart-outline' },
      { iconName: 'pin-outline' },
      { iconName: 'play-circle-outline' },
      { iconName: 'plus-outline' },
      { iconName: 'plus-circle-outline' },
      { iconName: 'plus-square-outline' },
      { iconName: 'power-outline' },
      { iconName: 'pricetags-outline' },
      { iconName: 'printer-outline' },
      { iconName: 'question-mark-outline' },
      { iconName: 'question-mark-circle-outline' },
      { iconName: 'radio-outline' },
      { iconName: 'radio-button-off-outline' },
      { iconName: 'radio-button-on-outline' },
      { iconName: 'recording-outline' },
      { iconName: 'refresh-outline' },
      { iconName: 'repeat-outline' },
      { iconName: 'rewind-left-outline' },
      { iconName: 'rewind-right-outline' },
      { iconName: 'save-outline' },
      { iconName: 'scissors-outline' },
      { iconName: 'search-outline' },
      { iconName: 'settings-outline' },
      { iconName: 'settings-2-outline' },
      { iconName: 'shake-outline' },
      { iconName: 'share-outline' },
      { iconName: 'shield-outline' },
      { iconName: 'shield-off-outline' },
      { iconName: 'shopping-bag-outline' },
      { iconName: 'shopping-cart-outline' },
      { iconName: 'shuffle-outline' },
      { iconName: 'shuffle-2-outline' },
      { iconName: 'skip-back-outline' },
      { iconName: 'skip-forward-outline' },
      { iconName: 'slash-outline' },
      { iconName: 'smartphone-outline' },
      { iconName: 'smiling-face-outline' },
      { iconName: 'speaker-outline' },
      { iconName: 'square-outline' },
      { iconName: 'star-outline' },
      { iconName: 'stop-circle-outline' },
      { iconName: 'sun-outline' },
      { iconName: 'swap-outline' },
      { iconName: 'sync-outline' },
      { iconName: 'text-outline' },
      { iconName: 'thermometer-outline' },
      { iconName: 'thermometer-minus-outline' },
      { iconName: 'thermometer-plus-outline' },
      { iconName: 'toggle-left-outline' },
      { iconName: 'toggle-right-outline' },
      { iconName: 'trash-outline' },
      { iconName: 'trash-2-outline' },
      { iconName: 'trending-down-outline' },
      { iconName: 'trending-up-outline' },
      { iconName: 'tv-outline' },
      { iconName: 'twitter-outline' },
      { iconName: 'umbrella-outline' },
      { iconName: 'undo-outline' },
      { iconName: 'unlock-outline' },
      { iconName: 'upload-outline' },
      { iconName: 'video-outline' },
      { iconName: 'video-off-outline' },
      { iconName: 'volume-down-outline' },
      { iconName: 'volume-mute-outline' },
      { iconName: 'volume-off-outline' },
      { iconName: 'volume-up-outline' },
      { iconName: 'wifi-outline' },
      { iconName: 'wifi-off-outline' },
    ],
    skipDuplicates: true,
  });
  console.log('✅ Category icons seeded (480)');

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
