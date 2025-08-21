import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.bookingService.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.service.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  const hashedPassword = await bcrypt.hash('password123', 10);

  const admin1 = await prisma.user.create({
    data: {
      name: 'Admin John',
      email: 'admin.john@example.com',
      password: hashedPassword,
      role: Role.admin,
    },
  });

  const admin2 = await prisma.user.create({
    data: {
      name: 'Admin Sarah',
      email: 'admin.sarah@example.com',
      password: hashedPassword,
      role: Role.admin,
    },
  });

  const user1 = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: hashedPassword,
      role: Role.user,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      password: hashedPassword,
      role: Role.user,
    },
  });

  const user3 = await prisma.user.create({
    data: {
      name: 'Mike Johnson',
      email: 'mike.johnson@example.com',
      password: hashedPassword,
      role: Role.user,
    },
  });

  // Create services
  const service1 = await prisma.service.create({
    data: {
      adminId: admin1.id,
      name: 'Haircut & Styling',
      description: 'Professional haircut and styling service',
      price: 50000,
      durationMinutes: 60,
    },
  });

  const service2 = await prisma.service.create({
    data: {
      adminId: admin1.id,
      name: 'Hair Coloring',
      description: 'Full hair coloring service with premium products',
      price: 150000,
      durationMinutes: 120,
    },
  });

  const service3 = await prisma.service.create({
    data: {
      adminId: admin2.id,
      name: 'Hair Treatment',
      description: 'Deep conditioning and hair treatment',
      price: 80000,
      durationMinutes: 90,
    },
  });

  const service4 = await prisma.service.create({
    data: {
      adminId: admin2.id,
      name: 'Beard Trim',
      description: 'Professional beard trimming and shaping',
      price: 30000,
      durationMinutes: 30,
    },
  });

  const service5 = await prisma.service.create({
    data: {
      adminId: admin1.id,
      name: 'Kids Haircut',
      description: 'Specialized haircut service for children',
      price: 35000,
      durationMinutes: 45,
    },
  });

  // Create bookings
  const booking1 = await prisma.booking.create({
    data: {
      userId: user1.id,
      bookingDate: new Date('2024-01-15T10:00:00Z'),
      status: 'confirmed',
      notes: 'First time customer, prefers short hair',
      handledByAdminId: admin1.id,
    },
  });

  const booking2 = await prisma.booking.create({
    data: {
      userId: user2.id,
      bookingDate: new Date('2024-01-16T14:00:00Z'),
      status: 'pending',
      notes: 'Wants to try new hair color',
    },
  });

  const booking3 = await prisma.booking.create({
    data: {
      userId: user3.id,
      bookingDate: new Date('2024-01-17T11:00:00Z'),
      status: 'confirmed',
      notes: 'Regular customer, maintenance trim',
      handledByAdminId: admin2.id,
    },
  });

  const booking4 = await prisma.booking.create({
    data: {
      userId: user1.id,
      bookingDate: new Date('2024-01-18T16:00:00Z'),
      status: 'cancelled',
      notes: 'Customer requested cancellation',
    },
  });

  const booking5 = await prisma.booking.create({
    data: {
      userId: user2.id,
      bookingDate: new Date('2024-01-19T09:00:00Z'),
      status: 'confirmed',
      notes: 'Follow-up appointment for hair treatment',
      handledByAdminId: admin1.id,
    },
  });

  // Create booking services
  await prisma.bookingService.create({
    data: {
      bookingId: booking1.id,
      serviceId: service1.id,
      quantity: 1,
    },
  });

  await prisma.bookingService.create({
    data: {
      bookingId: booking2.id,
      serviceId: service2.id,
      quantity: 1,
    },
  });

  await prisma.bookingService.create({
    data: {
      bookingId: booking2.id,
      serviceId: service3.id,
      quantity: 1,
    },
  });

  await prisma.bookingService.create({
    data: {
      bookingId: booking3.id,
      serviceId: service4.id,
      quantity: 1,
    },
  });

  await prisma.bookingService.create({
    data: {
      bookingId: booking5.id,
      serviceId: service3.id,
      quantity: 1,
    },
  });

  await prisma.bookingService.create({
    data: {
      bookingId: booking5.id,
      serviceId: service1.id,
      quantity: 1,
    },
  });
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
