require('dotenv').config();

module.exports = {
    token: process.env.token,
    clientId: process.env.clientId,
    welcomeChannelName: "・🚪┃ประตูเข้า",
    goodbyeChannelName: "・🚪┃ประตูออก",
    inviteLink: "https://discord.gg/Ha8cyS4U6h",
    rulesLink: "https://discord.com/channels/1350778247247564820/1350855397220814868",
    introLink: "https://discord.com/channels/1350778247247564820/1350778247247564825",
    decorativeRoles: [
        { name: '🌈 Prism', value: 'prism', color: '#ff00ff', description: 'สะท้อนแสงหลากสีดั่งปริซึม' },
        { name: '🔥 Ember', value: 'ember', color: '#ff4500', description: 'เปลวไฟร้อนแรงและทรงพลัง' },
        { name: '🌿 Evergreen', value: 'evergreen', color: '#228B22', description: 'ต้นไม้เขียวชอุ่มตลอดปี' },
        { name: '🌙 Moonlight', value: 'moonlight', color: '#708090', description: 'แสงจันทร์ส่องสว่างยามค่ำคืน' },
        { name: '❄️ Frost', value: 'frost', color: '#00ffff', description: 'น้ำแข็งเยือกแข็ง สงบนิ่งและเย็นชา' },
        { name: '⚡ Thunder', value: 'thunder', color: '#FFD700', description: 'สายฟ้าฟาด สว่างไสวและทรงพลัง' },
        { name: '🌊 Ocean', value: 'ocean', color: '#1E90FF', description: 'ทะเลลึก สงบแต่ทรงพลัง' },
        { name: '🌺 Blossom', value: 'blossom', color: '#FF69B4', description: 'ดอกไม้บานสะพรั่งสวยงาม' },
        { name: '🦋 Mirage', value: 'mirage', color: '#9370DB', description: 'ภาพลวงตาอันงดงามและลึกลับ' },
        { name: '🌞 Solstice', value: 'solstice', color: '#FFA500', description: 'พลังแห่งดวงอาทิตย์เจิดจ้า' }
    ],

    sexRoles: [
        { name: '👱🏻‍♂️ Male', value: 'Male', color: '#455ede', description: 'Male' },
        { name: '👧🏻 Female', value: 'female', color: '#f06292', description: 'Female' },
        { name: '🏳️‍🌈 LGBTQ+', value: 'lgbtq+', color: '#ba68c8', description: 'LGBTQ+' }
    ],

    gameRoles: [
        { name: '⛏️ Minecraft', value: 'minecraft', color: '#8B5D33', description: 'สายสร้างบ้าน สายขุดต้องมา!' },
        { name: '🖌️ Roblox', value: 'roblox', color: '#8B5D33', description: 'สายลุยแมพ ต้องเอาแล้วมั้ย' },
        { name: '🔫 Valorant', value: 'valorant', color: '#FF4655', description: 'FPS ระดับตึง ยิงเฮดช็อตให้ไว!' },
        { name: '⚔️ Genshin Impact', value: 'genshin', color: '#3498db', description: 'นักเดินทาง พร้อมออกผจญภัยกันหรือยัง?' },
        { name: '🏆 ROV', value: 'rov', color: '#E67E22', description: '5v5 ไต่แรงค์ ใครจะเป็น MVP?' },
        { name: '🚗 Five M', value: 'FM', color: '#2C3E50', description: 'ปล้นกันดี?' },
        { name: '🔫 Call of Duty', value: 'cod', color: '#555555', description: 'ยิงให้ไว เก็บคิลให้เยอะ!' },
        { name: '🛡️ CSGO', value: 'csgo', color: '#E03E3E', description: 'กระโดดลงสู่สมรภูมิ!' },
        { name: '⚽ FIFA', value: 'fifa', color: '#00A650', description: 'ซัดประตูให้แรง ไปสู่แชมป์โลก!' },
        { name: '🔫 Free Fire', value: 'ff', color: '#555555', description: 'ยิงให้ไว เก็บคิลให้เยอะ!' },
        { name: '🔫 PUBG', value: 'pubg', color: '#555555', description: 'ยิงให้ไว เก็บคิลให้เยอะ!' },
        { name: '⭐️ Honkai star rail', value: 'honkairail', color: '#5E2129', description: 'สายเนื้อเรื่องต้องจัด!' },
        { name: '🏹 LEAGUE OF LEGENDS', value: 'lol', color: '#D4AF37', description: 'พร้อมตายกี่ครั้งก็ยอม!' },
        { name: '👾 Overwatch 2', value: 'overwatch2', color: '#F99D27', description: 'สายสกิลเพลย์ ทีมไฟต์ต้องมา!' }
    ],

    colorRoles: [
        { name: '🔴 Red', value: 'red', color: '#ff0000', description: 'สีแดงสดใส' },
        { name: '🔵 Blue', value: 'blue', color: '#0055ff', description: 'สีน้ำเงินเข้ม' },
        { name: '🟢 Green', value: 'green', color: '#00ff00', description: 'สีเขียวธรรมชาติ' },
        { name: '🟣 Purple', value: 'purple', color: '#8800ff', description: 'สีม่วงแฟนตาซี' },
        { name: '🟡 Yellow', value: 'yellow', color: '#ffff00', description: 'สีเหลืองสดใส' },
        { name: '🟠 Orange', value: 'orange', color: '#ff8800', description: 'สีส้มพลังงาน' },
        { name: '⚫ Black', value: 'black', color: '#000000', description: 'สีดำลึกลับ' },
        { name: '⚪ White', value: 'white', color: '#ffffff', description: 'สีขาวบริสุทธิ์' },
        { name: '💖 Pink', value: 'pink', color: '#ff69b4', description: 'สีชมพูหวานๆ' },
        { name: '🌿 Lime Green', value: 'lime', color: '#32cd32', description: 'สีเขียวมะนาว' },
        { name: '💎 Cyan', value: 'cyan', color: '#00ffff', description: 'สีฟ้าน้ำทะเล' },
        { name: '🌅 Magenta', value: 'magenta', color: '#ff00ff', description: 'สีบานเย็นสุดแซ่บ' },
        { name: '☕ Brown', value: 'brown', color: '#8B4513', description: 'สีน้ำตาลอบอุ่น' },
        { name: '🌌 Midnight Blue', value: 'midnightblue', color: '#191970', description: 'สีน้ำเงินเข้มดั่งท้องฟ้ายามค่ำคืน' },
        { name: '⚜️ Gold', value: 'gold', color: '#ffd700', description: 'สีทองหรูหรา' },
        { name: '🌫️ Silver', value: 'silver', color: '#c0c0c0', description: 'สีเงินเงางาม' },
        { name: '🔥 Crimson', value: 'crimson', color: '#dc143c', description: 'สีแดงเข้มสุดร้อนแรง' },
        { name: '🎇 Violet', value: 'violet', color: '#ee82ee', description: 'สีม่วงอ่อนละมุน' },
        { name: '🌊 Teal', value: 'teal', color: '#008080', description: 'สีเขียวน้ำทะเล' }
    ],


    notificationRoles: [
        { name: '📢 Announcements', value: 'announcements', color: '#ff9966', description: 'รับการแจ้งเตือนประกาศสำคัญ' },
        { name: '🎉 Events', value: 'events', color: '#66ff99', description: 'รับการแจ้งเตือนกิจกรรม' },
        { name: '🔄 Updates', value: 'updates', color: '#99ccff', description: 'รับการแจ้งเตือนอัพเดทต่างๆ' },
    ]
};