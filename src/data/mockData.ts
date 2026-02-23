import { FeaturedItem, FloorCategory, NavItem } from '../types';

export const NAV_ITEMS: NavItem[] = [
    {
        id: 'trend',
        href: '/trend',
        subitems: [
            { id: 'popup', label: 'popup', href: '/trend?filter=popup' },
            { id: 'collab', label: 'collab', href: '/trend?filter=collab' },
            { id: 'new', label: 'new', href: '/trend?filter=new' }
        ]
    },
    {
        id: 'tickets',
        href: '/tickets',
        subitems: [
            { id: 'performance', label: 'performance', href: '/tickets?filter=performance' },
            { id: 'exhibition', label: 'exhibition', href: '/tickets?filter=exhibition' },
            { id: 'booking', label: 'booking', href: '/tickets?filter=booking' }
        ]
    },
    {
        id: 'art',
        href: '/art',
        subitems: [
            { id: 'class', label: 'class', href: '/art?filter=class' },
            { id: 'fashion', label: 'fashion', href: '/art?filter=fashion' }
        ]
    },
    {
        id: 'style',
        href: '/style',
        subitems: [
            { id: 'photo', label: 'photo', href: '/style?filter=photo' },
            { id: 'video', label: 'video', href: '/style?filter=video' },
            { id: 'media', label: 'media', href: '/style?filter=media' }
        ]
    },
    {
        id: 'travel',
        href: '/travel',
        subitems: [
            { id: 'local', label: 'local', href: '/travel?filter=local' },
            { id: 'course', label: 'course', href: '/travel?filter=course' },
            { id: 'guide', label: 'guide', href: '/travel?filter=guide' }
        ]
    },

    {
        id: 'community',
        href: '/community',
        subitems: [
            { id: 'notice', label: 'notice', href: '/community?filter=notice' },
            { id: 'qna', label: 'qna', href: '/community?filter=qna' },
            { id: 'reviews', label: 'reviews', href: '/community?filter=reviews' }
        ]
    },
];

export const FLOOR_CATEGORIES: FloorCategory[] = [
    {
        id: 'trend',
        floor: '1F',
        title: {
            ko: '트렌드 / 팝업',
            en: 'K-Trend / Pop-up',
            ja: 'トレンド / ポップアップ',
            zh: '流行趋势 / 快闪店'
        },
        description: {
            ko: '가장 핫한 K-컬처 트렌드를 만나보세요.',
            en: 'Discover the hottest K-Culture trends and goods.',
            ja: '最もホットなK-カルトレンドに出会ってください。',
            zh: '探索最热门的 K-Culture 趋势。'
        },
        bgImage: 'https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?q=80&w=2560&auto=format&fit=crop',
        content: [
            {
                type: 'text',
                value: {
                    ko: '1층은 가장 최신의 K-트렌드를 경험할 수 있는 역동적인 공간입니다. 매달 새로운 주제로 열리는 팝업 스토어와 트렌디한 브랜드들을 만나보세요. 단순한 쇼핑을 넘어 문화를 소비하고 체험하는 공간을 지향합니다.',
                    en: 'The 1st floor is a dynamic space where you can experience the latest K-trends. Meet pop-up stores and trendy brands with new themes every month. We aim for a space where you consume and experience culture beyond simple shopping.',
                    ja: '1階は最新のK-トレンドを体験できるダイナミックな空間です。毎月新しいテーマで開かれるポップアップストアとトレンディなブランドに出会ってください。単なるショッピングを超えて文化を消費し体験する空間を目指します。',
                    zh: '1楼是可以体验最新K-Trend的充满活力的空间。请通过每月以新主题开设的快闪店，接触时尚品牌。超越单纯的购物，旨在打造消费和体验文化的空间。'
                }
            },
            {
                type: 'image',
                value: 'https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?q=80&w=2560&auto=format&fit=crop',
                caption: {
                    ko: '매달 새로운 테마로 변신하는 중앙 팝업 존',
                    en: 'Central pop-up zone transforming with new themes every month',
                    ja: '毎月新しいテーマに変身する中央ポップアップゾーン',
                    zh: '每月以新主题变身的中央快闪区'
                }
            },
            {
                type: 'text',
                value: {
                    ko: 'MZ세대가 열광하는 다양한 브랜드와의 콜라보레이션 굿즈, 그리고 한정판 아이템들을 가장 먼저 만나볼 수 있는 곳입니다. 트렌드세터라면 놓칠 수 없는 핫플레이스입니다.',
                    en: 'This is the first place to find collaboration goods with various brands that the MZ generation is enthusiastic about, as well as limited edition items. It is a hot place that trendsetters cannot miss.',
                    ja: 'MZ世代が熱狂する様々なブランドとのコラボレーショングッズ、そして限定版アイテムを一番早く会える場所です。トレンドセッターなら見逃せないホットプレイスです。',
                    zh: '这是最先能见到MZ一代狂热的各种品牌合作商品和限量版商品的地方。如果是潮流引导者，这是不可错过的热门场所。'
                }
            }
        ]
    },
    {
        id: 'tickets',
        floor: '2F',
        title: {
            ko: '공연 / 전시',
            en: 'Performance / Exhibition',
            ja: '公演 / 展示',
            zh: '演出 / 展览'
        },
        description: {
            ko: '다채로운 예술의 향연.',
            en: 'A feast of colorful arts and performances.',
            ja: '多彩な芸術の饗宴。',
            zh: '丰富多彩的艺术盛宴。'
        },
        bgImage: 'https://images.unsplash.com/photo-1543431690-3b6be2c3cb19?q=80&w=2560&auto=format&fit=crop',
        content: [
            {
                type: 'text',
                value: {
                    ko: '2층은 예술과 관객이 만나는 소통의 장입니다. K-POP 홀로그램 콘서트부터 전통 공연, 그리고 현대 미술 전시까지 폭넓은 스펙트럼의 문화 예술을 선보입니다.',
                    en: 'The 2nd floor is a place of communication where art meets the audience. We present a wide spectrum of culture and arts, from K-POP hologram concerts to traditional performances and contemporary art exhibitions.',
                    ja: '2階は芸術と観客が出会うコミュニケーションの場です。K-POPホログラムコンサートから伝統公演、そして現代美術展示まで幅広いスペクトラムの文化芸術を披露します。',
                    zh: '2楼是艺术与观众见面的沟通场所。从K-POP全息图演唱会到传统演出，再到现代美术展览，展示了广泛的文化艺术。'
                }
            },
            {
                type: 'image',
                value: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=2560&auto=format&fit=crop',
                caption: {
                    ko: '몰입형 미디어 아트 전시관',
                    en: 'Immersive Media Art Exhibition Hall',
                    ja: '没入型メディアアート展示館',
                    zh: '沉浸式媒体艺术展馆'
                }
            },
            {
                type: 'text',
                value: {
                    ko: '365일 언제나 새로운 감동을 선사하는 공연장과 갤러리에서 일상의 휴식을 찾아보세요. 티켓 부스에서는 현재 진행 중인 모든 공연과 전시의 예매가 가능합니다.',
                    en: 'Find daily relaxation in the concert hall and gallery that always offer new impressions 365 days a year. At the ticket booth, you can book all ongoing performances and exhibitions.',
                    ja: '365日いつでも新しい感動をプレゼントする公演会場とギャラリーで日常の休息を探してみてください。チケットブースでは現在進行中のすべての公演と展示の予約が可能です。',
                    zh: '请在365天随时通过带来新感动的演出场和画廊寻找日常的休息。在售票处可以预订正在进行的所有演出和展览。'
                }
            }
        ]
    },
    {
        id: 'art',
        floor: '3F',
        title: {
            ko: '활동 / 스타일',
            en: 'Activity / Style',
            ja: 'アクティビティ / スタイル',
            zh: '活动 / 风格'
        },
        description: {
            ko: '활동과 스타일의 조화.',
            en: 'Harmony of Activity and Style.',
            ja: 'アクティビティとスタイルの調和。',
            zh: '活动与风格的和谐。'
        },
        bgImage: 'https://images.unsplash.com/photo-1517260739337-6799d239ce83?q=80&w=2560&auto=format&fit=crop',
        content: [
            {
                type: 'text',
                value: {
                    ko: '3층은 한국 전통 공예의 아름다움을 현대적으로 재해석한 공간입니다. 무형문화재 장인들의 명품부터 신진 작가들의 감각적인 공예품까지 다양한 작품을 감상하고 소장할 수 있습니다.',
                    en: 'The 3rd floor is a space that reinterprets the beauty of Korean traditional crafts in a modern way. You can appreciate and possess various works, from masterpieces by intangible cultural property artisans to sensuous crafts by new artists.',
                    ja: '3階は韓国伝統工芸の美しさを現代的に再解釈した空間です。無形文化財の職人たちの名品から新人作家たちの感覚的な工芸品まで、様々な作品を鑑賞して所蔵することができます。',
                    zh: '3楼是以现代方式重新诠释韩国传统工艺之美的空间。从无形文化遗产工匠的名品到新晋作家的感性工艺品，可以欣赏并收藏各种作品。'
                }
            },
            {
                type: 'image',
                value: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=2560&auto=format&fit=crop',
                caption: {
                    ko: '장인의 손길로 빚어낸 도자기 컬렉션',
                    en: 'Pottery collection created by artisans',
                    ja: '職人の手で作り出した陶磁器コレクション',
                    zh: '工匠亲手制作的陶瓷系列'
                }
            },
            {
                type: 'text',
                value: {
                    ko: '직접 도자기를 빚거나 자개를 붙여보는 원데이 클래스도 운영됩니다. 손끝으로 전해지는 흙과 재료의 물성을 느끼며 나만의 작품을 만들어보세요.',
                    en: 'One-day classes where you can make pottery or attach mother-of-pearl are also available. Create your own work while feeling the physical properties of soil and materials transmitted to your fingertips.',
                    ja: '直接陶磁器を作ったり、真珠層を付けたりするワンデークラスも運営されます。指先に伝わる土と材料の物性を感じながら、自分だけの作品を作ってみてください。',
                    zh: '还通过制作陶瓷或贴螺钿的一日课程。请感受指尖传来的泥土和材料的物性，制作属于自己的作品。'
                }
            }
        ]
    },
    {
        id: 'style',
        floor: '4F',
        title: {
            ko: '사진 / 영상',
            en: 'Photo / Video',
            ja: '写真 / 映像',
            zh: '照片 / 视频'
        },
        description: {
            ko: '창의적인 시각 예술과 미디어.',
            en: 'Creative visual arts and media.',
            ja: '創造的な視覚芸術とメディア。',
            zh: '创意视觉艺术和媒体。'
        },
        bgImage: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=2560&auto=format&fit=crop',
        content: [
            {
                type: 'text',
                value: {
                    ko: '4층은 한국적인 아름다움을 패션과 뷰티로 제안하는 스타일 존입니다. 일상에서 편하게 입을 수 있는 모던 한복과 글로벌 뷰티 트렌드를 선도하는 K-뷰티 브랜드를 한자리에 모았습니다.',
                    en: 'The 4th floor is a style zone that proposes Korean beauty through fashion and beauty. We have gathered modern Hanbok that can be worn comfortably in everyday life and K-beauty brands leading global beauty trends in one place.',
                    ja: '4階は韓国的な美しさをファッションとビューティーで提案するスタイルゾーンです。日常で楽に着られるモダン韓服とグローバルビューティートレンドをリードするK-ビューティーブランドを一堂に集めました。',
                    zh: '4楼是通过时尚和美容展现韩国之美的风格区。汇集了日常生活中可以舒适穿着的现代韩服和引领全球美容趋势的K-Beauty品牌。'
                }
            },
            {
                type: 'image',
                value: 'https://images.unsplash.com/photo-1558232777-74313d467af6?q=80&w=2560&auto=format&fit=crop',
                caption: {
                    ko: '전통과 현대가 어우러진 모던 한복 스타일링',
                    en: 'Modern Hanbok styling combining tradition and modernity',
                    ja: '伝統と現代が調和したモダン韓服スタイリング',
                    zh: '传统与现代相融合的现代韩服造型'
                }
            },
            {
                type: 'text',
                value: {
                    ko: '퍼스널 컬러 진단과 메이크업 시연 등 다채로운 체험 프로그램이 준비되어 있습니다. 당신만의 고유한 아름다움을 발견하는 시간을 가져보세요.',
                    en: 'Various experience programs such as personal color diagnosis and makeup demonstrations are available. Take time to discover your own unique beauty.',
                    ja: 'パーソナルカラー診断やメイクアップ試演など、多彩な体験プログラムが用意されています。あなただけの固有の美しさを発見する時間を持ってみてください。',
                    zh: '准备了个人色彩诊断和化妆演示等丰富多彩的体验项目。请花点时间发现属于自己的独特之美。'
                }
            }
        ]
    },

    {
        id: 'travel',
        floor: '5F',
        title: {
            ko: '로컬 / 여행',
            en: 'Local / Travel',
            ja: 'ローカル / 旅行',
            zh: '本地 / 旅游'
        },
        description: {
            ko: '엄선된 로컬 굿즈와 여행 큐레이션.',
            en: 'Curated local goods and travel information.',
            ja: '厳選されたローカルグッズと旅行キュレーション。',
            zh: '精选本地商品和旅游策展。'
        },
        bgImage: 'https://images.unsplash.com/photo-1596120364993-90dcc247f07e?q=80&w=2560&auto=format&fit=crop',
        content: [
            {
                type: 'text',
                value: {
                    ko: '6층은 대한민국 곳곳의 숨겨진 매력을 발굴하는 여행 큐레이션 라운지입니다. 지역 명소와 특산품, 그리고 그곳에 사는 사람들의 이야기를 소개합니다.',
                    en: 'The 6th floor is a travel curation lounge that discovers hidden charms all over Korea. We introduce local attractions, specialties, and the stories of the people living there.',
                    ja: '6階は大韓民国の至る所の隠された魅力を発掘する旅行キュレーションラウンジです。地域の名所と特産品、そしてそこに住む人々の話を紹介します。',
                    zh: '6楼是发掘韩国各地隐藏魅力的旅游策展休息室。介绍地区名胜和特产，以及住在那里的人们的故事。'
                }
            },
            {
                type: 'image',
                value: 'https://images.unsplash.com/photo-1583248369069-9d91f1640fe6?q=80&w=2560&auto=format&fit=crop',
                caption: {
                    ko: '한옥의 정취를 느낄 수 있는 로컬 스테이 정보',
                    en: 'Local stay information where you can feel the mood of Hanok',
                    ja: '韓屋の趣を感じることができるローカルステイ情報',
                    zh: '可以感受韩屋情趣的当地住宿信息'
                }
            },
            {
                type: 'text',
                value: {
                    ko: '나만의 맞춤형 여행 코스를 설계해주는 컨시어지 서비스와 함께 잊지 못할 추억을 계획해보세요. 로컬 크리에이터들이 만든 유니크한 굿즈들도 만나볼 수 있습니다.',
                    en: 'Plan unforgettable memories with a concierge service that designs your own customized travel course. You can also meet unique goods made by local creators.',
                    ja: '自分だけのカスタマイズ旅行コースを設計してくれるコンシェルジュサービスと一緒に忘れられない思い出を計画してみてください。ローカルクリエイターが作ったユニークなグッズにも出会えます。',
                    zh: '请与为您设计量身定做旅游路线的礼宾服务一起计划难忘的回忆。还可以见到当地创作者制作的独特商品。'
                }
            }
        ]
    },
];

export const FEATURED_ITEMS: FeaturedItem[] = [
    // Travel
    {
        id: 'gyeongbokgung-night',
        title: { ko: '경복궁 야간 개장 투어', en: 'Gyeongbokgung Night Tour', ja: '景福宮夜間特別観覧', zh: '景福宫夜间开放游览' },
        category: 'Travel',
        description: {
            ko: '달빛 아래 고궁을 거니는 특별한 경험. 전문 해설사와 함께하는 프라이빗 야간 투어입니다.',
            en: 'A special experience walking through the ancient palace under the moonlight. A private night tour with a professional guide.',
            ja: '月明かりの下、古宮を歩く特別な体験。専門解説士と共にするプライベート夜間ツアーです。',
            zh: '月光下漫步古宫的特别体验。与专业讲解员一起进行的私人夜间游览。'
        },
        imageUrl: 'https://images.unsplash.com/photo-1590635327202-b53050a49826?q=80&w=2560&auto=format&fit=crop',
        date: { ko: '2023.10.01 - 2023.10.31', en: 'Oct 01 - Oct 31, 2023', ja: '2023.10.01 - 2023.10.31', zh: '2023.10.01 - 2023.10.31' },
        location: { ko: '서울 종로구 사직로 161', en: '161 Sajik-ro, Jongno-gu, Seoul', ja: 'ソウル鍾路区社稷路161', zh: '首尔钟路区社稷路161' },
        price: { ko: '30,000원', en: '30,000 KRW', ja: '30,000ウォン', zh: '30,000韩元' }
    },
    {
        id: 'jeonju-hanok',
        title: { ko: '전주 한옥마을 스테이', en: 'Jeonju Hanok Village Stay', ja: '全州韓屋村ステイ', zh: '全州韩屋村住宿' },
        category: 'Travel',
        subcategory: 'local',
        description: {
            ko: '고즈넉한 한옥에서의 하룻밤. 전통 다도 체험과 비빔밥 만들기 클래스가 포함되어 있습니다.',
            en: 'A night in a quiet Hanok. Includes traditional tea ceremony experience and Bibimbap making class.',
            ja: '静かな韓屋での一夜。伝統茶道体験とビビンバ作りクラスが含まれています。',
            zh: '在宁静的韩屋过夜。包括传统茶道体验和制作拌饭课程。'
        },
        imageUrl: 'https://images.unsplash.com/photo-1583248369069-9d91f1640fe6?q=80&w=2560&auto=format&fit=crop',
        date: { ko: '상시 운영', en: 'Always Open', ja: '常時運営', zh: '常年运营' },
        location: { ko: '전북 전주시 완산구 기린대로 99', en: '99 Girin-daero, Wansan-gu, Jeonju', ja: '全北全州市完山区麒麟大路99', zh: '全北全州市完山区麒麟大路99' },
        price: { ko: '150,000원~', en: 'From 150,000 KRW', ja: '150,000ウォン~', zh: '150,000韩元起' }
    },

    // Tickets (Performance/Exhibition)
    {
        id: 'bts-exhibition',
        title: { ko: 'K-POP 히스토리 전시', en: 'K-POP History Exhibition', ja: 'K-POPヒストリー展示', zh: 'K-POP历史展览' },
        category: 'Exhibition',
        subcategory: 'exhibition',
        description: {
            ko: '대한민국 대중음악의 역사를 한눈에 볼 수 있는 특별 기획전.',
            en: 'A special exhibition where you can see the history of Korean popular music at a glance.',
            ja: '韓国大衆音楽の歴史を一目で見ることができる特別企画展。',
            zh: '可以一目了然地看到韩国大众音乐历史的特别企划展。'
        },
        imageUrl: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=2560&auto=format&fit=crop',
        date: { ko: '2023.11.01 - 2024.02.28', en: 'Nov 01, 2023 - Feb 28, 2024', ja: '2023.11.01 - 2024.02.28', zh: '2023.11.01 - 2024.02.28' },
        location: { ko: 'DDP 배움터 2층', en: 'DDP, 2nd Floor', ja: 'DDP学び場2階', zh: 'DDP学习中心2楼' },
        price: { ko: '20,000원', en: '20,000 KRW', ja: '20,000ウォン', zh: '20,000韩元' }
    },
    {
        id: 'pansori-performance',
        title: { ko: '현대적으로 재해석한 판소리: 춘향', en: 'Modernized Pansori: Chunhyang', ja: '現代的に再解釈したパンソリ：春香', zh: '现代再诠释的板索里: 春香' },
        category: 'Performance',
        subcategory: 'performance',
        description: {
            ko: '전통 판소리에 미디어아트를 결합한 퓨전 국악 공연. 춘향전을 새로운 시각으로 풀어냅니다.',
            en: 'Fusion Korean traditional music performance combining traditional Pansori with media art. Retells Chunhyangjeon from a new perspective.',
            ja: '伝統パンソリにメディアアートを融合させたフュージョン国楽公演。春香伝を新しい視点で解き明かします。',
            zh: '结合传统板索里和媒体艺术的融合国乐演出。以新的视角诠释春香传。'
        },
        imageUrl: 'https://images.unsplash.com/photo-1514533248912-c96053de8a94?q=80&w=2560&auto=format&fit=crop',
        date: { ko: '2023.10.15 - 2023.10.20', en: 'Oct 15 - Oct 20, 2023', ja: '2023.10.15 - 2023.10.20', zh: '2023.10.15 - 2023.10.20' },
        location: { ko: '국립극장 해오름', en: 'National Theater of Korea', ja: '国立劇場ヘオルム', zh: '国立剧场' },
        price: { ko: '50,000원', en: '50,000 KRW', ja: '50,000ウォン', zh: '50,000韩元' }
    },

    // Art (Art/Craft)
    {
        id: 'celadon-workshop',
        title: { ko: '청자 만들기 원데이 클래스', en: 'Celadon Making One-day Class', ja: '青磁作りワンデークラス', zh: '制作青瓷一日课程' },
        category: 'Art',
        subcategory: 'class',
        description: {
            ko: '나만의 고려청자를 만들어보는 이색 체험. 물레 성형부터 조각까지 직접 경험해보세요.',
            en: 'A unique experience of making your own Goryeo Celadon. Experience everything from wheel throwing to carving.',
            ja: '自分だけの高麗青磁を作ってみる異色の体験。ろくろ成形から彫刻まで直接体験してみてください。',
            zh: '制作专属于自己的高丽青瓷的特色体验。请亲自体验从拉坯成型到雕刻。'
        },
        imageUrl: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=2560&auto=format&fit=crop',
        date: { ko: '매주 토요일', en: 'Every Saturday', ja: '毎週土曜日', zh: '每周六' },
        location: { ko: '이천 도자기 마을', en: 'Icheon Ceramics Village', ja: '利川陶磁器村', zh: '利川陶瓷村' },
        price: { ko: '80,000원', en: '80,000 KRW', ja: '80,000ウォン', zh: '80,000韩元' }
    },
    {
        id: 'moon-jar-exhibition',
        title: { ko: '달항아리 특별전: 비움의 미학', en: 'Moon Jar Exhibition: Aesthetics of Emptiness', ja: '月壺特別展：空の美学', zh: '月亮罐特别展: 空的各种美学' },
        category: 'Art',
        description: {
            ko: '조선 백자의 정수, 달항아리 30여 점을 한자리에서 만나는 전시.',
            en: 'An exhibition where you can meet about 30 Moon Jars, the essence of Joseon white porcelain, in one place.',
            ja: '朝鮮白磁の精髄、月壺30点余りを一堂に会する展示。',
            zh: '在一处欣赏朝鲜白瓷的精髓——30多件月亮罐的展览。'
        },
        imageUrl: 'https://images.unsplash.com/photo-1579402507856-3bb912df0f63?q=80&w=2560&auto=format&fit=crop',
        date: { ko: '2023.09.01 - 2023.12.31', en: 'Sep 01 - Dec 31, 2023', ja: '2023.09.01 - 2023.12.31', zh: '2023.09.01 - 2023.12.31' },
        location: { ko: '리움 미술관', en: 'Leeum Museum of Art', ja: 'リウム美術館', zh: 'Leeum美术馆' },
        price: { ko: '15,000원', en: '15,000 KRW', ja: '15,000ウォン', zh: '15,000韩元' }
    },

    // Trend (1F)
    {
        id: 'k-pop-popup',
        title: { ko: '뉴진스(NewJeans) 팝업스토어', en: 'NewJeans Pop-up Store', ja: 'NewJeansポップアップストア', zh: 'NewJeans快闪店' },
        category: 'Trend',
        subcategory: 'popup',
        description: {
            ko: '글로벌 대세 뉴진스의 공식 굿즈와 한정판 아이템을 만날 수 있는 팝업스토어.',
            en: 'A pop-up store where you can find official goods and limited edition items of the global trend NewJeans.',
            ja: 'グローバル大勢NewJeansの公式グッズと限定版アイテムに出会えるポップアップストア。',
            zh: '可以见到全球大势NewJeans的官方周边商品和限量版商品的快闪店。'
        },
        imageUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=2560&auto=format&fit=crop',
        date: { ko: '2023.10.20 - 2023.11.05', en: 'Oct 20 - Nov 05, 2023', ja: '2023.10.20 - 2023.11.05', zh: '2023.10.20 - 2023.11.05' },
        location: { ko: '1F 팝업존', en: '1F Pop-up Zone', ja: '1F ポップアップゾーン', zh: '1F 快闪区' },
        price: { ko: '무료 입장', en: 'Free Admission', ja: '入場無料', zh: '免费入场' }
    },
    {
        id: 'retro-camera',
        title: { ko: 'Y2K 레트로 카메라 기획전', en: 'Y2K Retro Camera Exhibition', ja: 'Y2Kレトロカメラ企画展', zh: 'Y2K复古相机企划展' },
        category: 'Trend',
        description: {
            ko: '다시 유행하는 필름 카메라와 빈티지 디카를 직접 체험하고 구매하세요.',
            en: 'Experience and purchase film cameras and vintage digital cameras that are back in fashion.',
            ja: '再び流行しているフィルムカメラとヴィンテージデジカメを直接体験して購入してください。',
            zh: '请亲自体验并购买重新流行的胶卷相机和复古数码相机。'
        },
        imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=2560&auto=format&fit=crop',
        date: { ko: '2023.10.01 - 2023.10.31', en: 'Oct 01 - Oct 31, 2023', ja: '2023.10.01 - 2023.10.31', zh: '2023.10.01 - 2023.10.31' },
        location: { ko: '1F 트렌드홀', en: '1F Trend Hall', ja: '1F トレンドホール', zh: '1F 潮流馆' },
        price: { ko: '가격 문의', en: 'Inquire for Price', ja: '価格問い合わせ', zh: '价格咨询' }
    },

    // Style (4F)
    {
        id: 'modern-hanbok',
        title: { ko: '생활한복 F/W 컬렉션', en: 'Modern Hanbok F/W Collection', ja: '生活韓服 F/Wコレクション', zh: '生活韩服 F/W 系列' },
        category: 'Art',
        subcategory: 'fashion',
        description: {
            ko: '일상에서 편하게 입는 현대적인 감각의 생활한복 신상 컬렉션.',
            en: 'New collection of modern Hanbok with a modern sense that is comfortable to wear in everyday life.',
            ja: '日常で楽に着る現代的な感覚の生活韓服新作コレクション。',
            zh: '在日常生活中舒适穿着的具有现代感的生活韩服新产品系列。'
        },
        imageUrl: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?q=80&w=2560&auto=format&fit=crop',
        date: { ko: '상시 운영', en: 'Always Open', ja: '常時運営', zh: '常年运营' },
        location: { ko: '4F 스타일관', en: '4F Style Hall', ja: '4F スタイル館', zh: '4F 时尚馆' },
        price: { ko: '100,000원~', en: 'From 100,000 KRW', ja: '100,000ウォン~', zh: '100,000韩元起' }
    },
    {
        id: 'k-beauty-consulting',
        title: { ko: '퍼스널 컬러 & K-뷰티 컨설팅', en: 'Personal Color & K-Beauty Consulting', ja: 'パーソナルカラー & K-ビューティーコンサルティング', zh: '个人色彩 & K-Beauty 咨询' },
        category: 'Art',
        subcategory: 'fashion',
        description: {
            ko: '나에게 맞는 색과 메이크업을 찾아주는 1:1 뷰티 컨설팅 서비스.',
            en: '1:1 beauty consulting service that finds the colors and makeup that suit you.',
            ja: '自分に合う色とメイクを見つけてくれる1:1ビューティーコンサルティングサービス。',
            zh: '寻找适合自己的颜色和化妆的1:1美容咨询服务。'
        },
        imageUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=2560&auto=format&fit=crop',
        date: { ko: '예약제 운영', en: 'Reservation Only', ja: '予約制運営', zh: '预约制运营' },
        location: { ko: '4F 뷰티 라운지', en: '4F Beauty Lounge', ja: '4F ビューティーラウンジ', zh: '4F 美容休息室' },
        price: { ko: '50,000원', en: '50,000 KRW', ja: '50,000ウォン', zh: '50,000韩元' }
    },


];
