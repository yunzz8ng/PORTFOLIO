const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('my_db', 'root', 'wjddbswjd75.', {
    host: 'localhost',
    dialect: 'mysql'
});

// User 모델 정의
const User = sequelize.define('User', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // 이메일 중복 방지
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: true, // 전화번호는 선택 사항
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {
    tableName: 'user',
    timestamps: true, // createdAt, updatedAt 자동 생성
});

// Post 모델 정의
const Post = sequelize.define('Post', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    user_id: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    title: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
}, {
    tableName: 'post',
    timestamps: true,
});

// Comment 모델 정의
const Comment = sequelize.define('Comment', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    user_id: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    post_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
}, {
    tableName: 'comment',
    timestamps: true,
});

// Likes 모델 정의
const Likes = sequelize.define('Likes', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    user_id: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    post_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    comment_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
}, {
    tableName: 'likes',
    timestamps: true,
});

// 관계 설정
User.hasMany(Post, { foreignKey: 'user_id' });
Post.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(Comment, { foreignKey: 'user_id' });
Comment.belongsTo(User, { foreignKey: 'user_id' });

Post.hasMany(Comment, { foreignKey: 'post_id' });
Comment.belongsTo(Post, { foreignKey: 'post_id' });

User.hasMany(Likes, { foreignKey: 'user_id' });
Post.hasMany(Likes, { foreignKey: 'post_id' });
Comment.hasMany(Likes, { foreignKey: 'comment_id' });
Likes.belongsTo(User, { foreignKey: 'user_id' });
Likes.belongsTo(Post, { foreignKey: 'post_id' });
Likes.belongsTo(Comment, { foreignKey: 'comment_id' });

// 데이터베이스 동기화
const syncDatabase = async () => {
    try {
        await sequelize.sync();
        console.log('Database & tables created!');
    } catch (error) {
        console.error('Error creating database:', error);
    }
};

syncDatabase();

module.exports = { User, Post, Comment, Likes, sequelize };