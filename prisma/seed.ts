import { PrismaClient, UserRole, BookingStatus, PaymentStatus } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Начинаем seed базы данных...')

    // Очищаем таблицы в правильном порядке (из-за foreign keys)
    await prisma.notification.deleteMany()
    await prisma.cart.deleteMany()
    await prisma.staff.deleteMany()
    await prisma.review.deleteMany()
    await prisma.favorite.deleteMany()
    await prisma.booking.deleteMany()
    await prisma.equipment.deleteMany()
    await prisma.category.deleteMany()
    await prisma.user.deleteMany()

    // Создаем тестового пользователя
    const user = await prisma.user.create({
        data: {
            email: 'test@example.com',
            password: '$2b$10$ExampleHash', // В реальности: bcrypt hash
            name: 'Иван Иванов',
            phone: '+79161234567',
            role: UserRole.CUSTOMER,
        },
    })

    // Создаем администратора
    const admin = await prisma.user.create({
        data: {
            email: 'admin@rental.com',
            password: '$2b$10$AdminHash',
            name: 'Администратор',
            role: UserRole.ADMIN,
        },
    })

    // Создаем категории
    const categories = await Promise.all([
        prisma.category.create({
            data: {
                name: 'Аудио оборудование',
                slug: 'audio',
                description: 'Микшеры, акустические системы, микрофоны',
                image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800',
                icon: 'Music',
            },
        }),
        prisma.category.create({
            data: {
                name: 'Видео оборудование',
                slug: 'video',
                description: 'Проекторы, LED-панели, видеостены',
                image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800',
                icon: 'Video',
            },
        }),
        prisma.category.create({
            data: {
                name: 'Световое оборудование',
                slug: 'lighting',
                description: 'Прожекторы, светодиодные ленты, лазеры',
                image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800',
                icon: 'Lightbulb',
            },
        }),
        prisma.category.create({
            data: {
                name: 'Сценическое оборудование',
                slug: 'stage',
                description: 'Сцены, трибуны, баннеры',
                image: 'https://images.unsplash.com/photo-1501281667305-0d4eb5394f8d?w=800',
                icon: 'Layout',
            },
        }),
    ])

    // Создаем оборудование (ИСПРАВЛЕНО для SQLite)
    const equipmentData = [
        {
            name: 'Профессиональный микшерный пульт Yamaha CL5',
            slug: 'yamaha-cl5-mixer',
            description: 'Цифровой микшерный пульт для концертов',
            fullDescription: '32 канала, поддержка Dante, встроенные эффекты, USB запись',
            pricePerDay: 4500,
            pricePerWeek: 25000,
            pricePerMonth: 80000,
            quantity: 3,
            featured: true,
            categoryId: categories[0].id,
            images: JSON.stringify([  // ИСПРАВЛЕНО: JSON.stringify для SQLite
                'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800',
            ]),
            mainImage: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800',
            powerRequirements: '220V, 16A',
            weight: 25.5,
            dimensions: '120x60x40 см',
            brand: 'Yamaha',
            model: 'CL5',
            serialNumber: 'YAMAHA-CL5-001',
        },
        {
            name: 'LED панель 55" 4K Samsung QLED',
            slug: 'samsung-55-qled',
            description: 'Профессиональная LED панель для конференций',
            fullDescription: '4K разрешение 3840x2160, HDR10+, Smart TV, мультиэкранный режим',
            pricePerDay: 12000,
            pricePerWeek: 65000,
            pricePerMonth: 200000,
            quantity: 5,
            featured: true,
            categoryId: categories[1].id,
            images: JSON.stringify([  // ИСПРАВЛЕНО
                'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop',
            ]),
            mainImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800',
            weight: 35.2,
            dimensions: '125x75x8 см',
            brand: 'Samsung',
            model: 'QN55Q80B',
            serialNumber: 'SAMSUNG-Q80B-001',
        },
        {
            name: 'Прожектор Moving Head Beam 400W',
            slug: 'moving-head-beam-400w',
            description: 'Мощный подвижный прожектор для сцены',
            fullDescription: 'Угол луча 5°, DMX512, RGBW, строб-эффект, скорость вращения 540°/сек',
            pricePerDay: 6500,
            pricePerWeek: 35000,
            pricePerMonth: 120000,
            quantity: 8,
            featured: true,
            categoryId: categories[2].id,
            images: JSON.stringify([  // ИСПРАВЛЕНО
                'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&auto=format&fit=crop',
            ]),
            mainImage: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800',
            powerRequirements: '220V, 10A',
            weight: 18.7,
            dimensions: '50x50x80 см',
            brand: 'Clay Paky',
            model: 'Sharpy',
            serialNumber: 'CLAY-SHARPY-001',
        },
        {
            name: 'Акустическая система JBL SRX 2000W',
            slug: 'jbl-srx-2000w',
            description: 'Мощная акустика для outdoor мероприятий',
            fullDescription: '2000W RMS, частотный диапазон 35Hz-20kHz, влагозащищенный корпус',
            pricePerDay: 2200,
            pricePerWeek: 12000,
            pricePerMonth: 40000,
            quantity: 6,
            featured: false,
            categoryId: categories[0].id,
            images: JSON.stringify([  // ИСПРАВЛЕНО
                'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800',
            ]),
            mainImage: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800',
            powerRequirements: '220V, 16A',
            weight: 42.3,
            dimensions: '80x60x120 см',
            brand: 'JBL',
            model: 'SRX828SP',
            serialNumber: 'JBL-SRX828-001',
        },
        {
            name: 'Проектор Epson EB-U50 5000 люмен',
            slug: 'epson-eb-u50-projector',
            description: 'Яркий проектор для больших помещений',
            fullDescription: '5000 люмен, Full HD, поддержка 3D, LAN управление',
            pricePerDay: 3500,
            pricePerWeek: 18000,
            pricePerMonth: 60000,
            quantity: 4,
            featured: true,
            categoryId: categories[1].id,
            images: JSON.stringify([  // ИСПРАВЛЕНО
                'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800',
            ]),
            mainImage: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800',
            powerRequirements: '220V, 5A',
            weight: 8.2,
            dimensions: '40x30x15 см',
            brand: 'Epson',
            model: 'EB-U50',
            serialNumber: 'EPSON-U50-001',
        },
    ]

    const equipment = []
    for (const data of equipmentData) {
        const eq = await prisma.equipment.create({ data })
        equipment.push(eq)
    }

    // Создаем тестовый заказ
    const booking = await prisma.booking.create({
        data: {
            status: BookingStatus.CONFIRMED,
            startDate: new Date('2024-12-01'),
            endDate: new Date('2024-12-03'),
            totalDays: 2,
            totalPrice: 9000,
            eventType: 'Конференция',
            eventAddress: 'Москва, ул. Тверская, 1',
            eventDate: new Date('2024-12-02'),
            attendeesCount: 150,
            userId: user.id,
            equipmentId: equipment[0].id,
            paymentStatus: PaymentStatus.PAID,
            paymentMethod: 'card',
        },
    })

    // Создаем отзыв
    await prisma.review.create({
        data: {
            rating: 5,
            comment: 'Отличное оборудование, все работало идеально!',
            isVerified: true,
            userId: user.id,
            equipmentId: equipment[0].id,
        },
    })

    // Создаем избранное
    await prisma.favorite.create({
        data: {
            userId: user.id,
            equipmentId: equipment[1].id,
        },
    })

    // Создаем сотрудника (ИСПРАВЛЕНО для SQLite)
    await prisma.staff.create({
        data: {
            userId: admin.id,
            position: 'Технический директор',
            permissions: JSON.stringify(['read', 'write', 'delete']), // ИСПРАВЛЕНО
            department: 'technical',
        },
    })

    // Создаем уведомление
    await prisma.notification.create({
        data: {
            userId: user.id,
            type: 'BOOKING_UPDATE',
            title: 'Заказ подтвержден',
            message: `Ваш заказ #${booking.id} на оборудование "${equipment[0].name}" подтвержден`,
            link: `/bookings/${booking.id}`,
        },
    })

    console.log('✅ Seed данные успешно созданы!')
    console.log(`👤 Пользователей: ${await prisma.user.count()}`)
    console.log(`📊 Категорий: ${await prisma.category.count()}`)
    console.log(`🎛️ Оборудования: ${await prisma.equipment.count()}`)
    console.log(`📅 Заказов: ${await prisma.booking.count()}`)
    console.log(`⭐ Отзывов: ${await prisma.review.count()}`)
}

main()
    .catch((e) => {
        console.error('❌ Ошибка seed:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })