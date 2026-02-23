import pool from '../src/config/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

const CATEGORIES = [
    { name: 'Travel', description: 'Travel spots and experiences' },
    { name: 'Exhibition', description: 'Museums and Exhibitions' },
    { name: 'Performance', description: 'Live performances' },
    { name: 'Art', description: 'Art and crafts' },
    { name: 'General', description: 'General items' }
];

const PRODUCTS = [
    {
        title: '경복궁 야간 개장 투어',
        category: 'Travel',
        description: '달빛 아래 고궁을 거니는 특별한 경험. 전문 해설사와 함께하는 프라이빗 야간 투어입니다.',
        imageUrl: 'https://images.unsplash.com/photo-1590635327202-b53050a49826?q=80&w=2560&auto=format&fit=crop',
        price: 30000,
        stock: 50,
        details: JSON.stringify({
            date: '2023.10.01 - 2023.10.31',
            location: '서울 종로구 사직로 161'
        })
    },
    {
        title: '전주 한옥마을 스테이',
        category: 'Travel',
        description: '고즈넉한 한옥에서의 하룻밤. 전통 다도 체험과 비빔밥 만들기 클래스가 포함되어 있습니다.',
        imageUrl: 'https://images.unsplash.com/photo-1583248369069-9d91f1640fe6?q=80&w=2560&auto=format&fit=crop',
        price: 150000,
        stock: 10,
        details: JSON.stringify({
            date: '상시 운영',
            location: '전북 전주시 완산구 기린대로 99'
        })
    },
    {
        title: 'K-POP 히스토리 전시',
        category: 'Exhibition',
        description: '대한민국 대중음악의 역사를 한눈에 볼 수 있는 특별 기획전.',
        imageUrl: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=2560&auto=format&fit=crop',
        price: 20000,
        stock: 100,
        details: JSON.stringify({
            date: '2023.11.01 - 2024.02.28',
            location: 'DDP 배움터 2층'
        })
    },
    {
        title: '현대적으로 재해석한 판소리: 춘향',
        category: 'Performance',
        description: '전통 판소리에 미디어아트를 결합한 퓨전 국악 공연. 춘향전을 새로운 시각으로 풀어냅니다.',
        imageUrl: 'https://images.unsplash.com/photo-1514533248912-c96053de8a94?q=80&w=2560&auto=format&fit=crop',
        price: 50000,
        stock: 30,
        details: JSON.stringify({
            date: '2023.10.15 - 2023.10.20',
            location: '국립극장 해오름'
        })
    },
    {
        title: '청자 만들기 원데이 클래스',
        category: 'Art',
        description: '나만의 고려청자를 만들어보는 이색 체험. 물레 성형부터 조각까지 직접 경험해보세요.',
        imageUrl: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=2560&auto=format&fit=crop',
        price: 80000,
        stock: 20,
        details: JSON.stringify({
            date: '매주 토요일',
            location: '이천 도자기 마을'
        })
    },
    {
        title: '달항아리 특별전: 비움의 미학',
        category: 'Art',
        description: '조선 백자의 정수, 달항아리 30여 점을 한자리에서 만나는 전시.',
        imageUrl: 'https://images.unsplash.com/photo-1579402507856-3bb912df0f63?q=80&w=2560&auto=format&fit=crop',
        price: 15000,
        stock: 200,
        details: JSON.stringify({
            date: '2023.09.01 - 2023.12.31',
            location: '리움 미술관'
        })
    }
];

async function seedDB() {
    try {
        console.log('Seeding database...');
        const connection = await pool.getConnection();

        // Seed Categories
        console.log('Inserting categories...');
        for (const cat of CATEGORIES) {
            await connection.query(
                'INSERT IGNORE INTO categories (name, description) VALUES (?, ?)',
                [cat.name, cat.description]
            );
        }

        // Get Category Map
        const [rows] = await connection.query<RowDataPacket[]>('SELECT id, name FROM categories');
        const categoryMap: { [key: string]: number } = {};
        rows.forEach((row: any) => {
            categoryMap[row.name] = row.id;
        });

        // Seed Products
        console.log('Inserting products...');
        for (const prod of PRODUCTS) {
            const categoryId = categoryMap[prod.category];
            if (!categoryId) {
                console.warn(`Category ${prod.category} not found for product ${prod.title}`);
                continue;
            }

            // Check if product exists to avoid duplicates (based on name for simplicity)
            const [existing] = await connection.query<RowDataPacket[]>(
                'SELECT id FROM products WHERE name = ?',
                [prod.title]
            );

            if (existing.length === 0) {
                await connection.query(
                    'INSERT INTO products (name, description, price, category_id, stock, image_url, details) VALUES (?, ?, ?, ?, ?, ?, ?)',
                    [prod.title, prod.description, prod.price, categoryId, prod.stock, prod.imageUrl, prod.details]
                );
                console.log(`Inserted: ${prod.title}`);
            } else {
                console.log(`Skipped (exists): ${prod.title}`);
            }
        }

        connection.release();
        console.log('✅ Database seeded successfully.');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
}

seedDB();
