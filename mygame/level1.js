var level1 = {
    preload: function () {
        game.load.spritesheet('dude', 'blueSprite.png', 100, 100);
        game.load.image('btn', 'arrowUp.png');
        game.load.image('btn1', 'arrowDown.png');
        game.load.image('btn3', 'shadedDark36.png');
        game.load.image("laser", 'laserYellowHorizontal.png');
        game.load.image('mushroom', 'tinyShroom_brown.png');
        game.load.image('mush1', 'tinyShroom_red.png');
        game.load.image('mush2', 'tinyShroom_tan.png');
        game.load.image('plat', 'cakePlatf.png');
        game.load.image("bg", "download.jpg");
    },
    btn3: null,
    bulletTime: 0,
    bullets: null,
    mushroom: null,
    player: null,
    hp: 3,
    text: null,
    case: ["mush1", "mush2"],
    create: function () {
        game.stage.backgroundColor = "#c3b946";
        game.physics.startSystem(Phaser.Physics.ARCADE);
        this.bg = game.add.sprite(game.world.width - 1200, game.world.height, 'bg');
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.btn = game.add.sprite(0, game.world.height-50, 'btn');
        this.btn.anchor.setTo(0, 1)
        this.btn1 = game.add.sprite(game.world.width - 1100, game.world.height-50, 'btn1');
        this.btn1.anchor.setTo(0, 1);

        this.bg.anchor.setTo(0, 1);
        this.bg.scale.setTo(4.5);
        this.btn3 = game.add.sprite(game.world.width - 100, game.world.height-50, 'btn3');
        this.btn3.anchor.setTo(0, 1);
        this.player = game.add.sprite(game.world.width - 1200, game.world.height - 700, 'dude');
        game.physics.arcade.enable([this.player]);
        this.player.animations.add('left', [0, 1, 2], 10, true);
        this.player.animations.add('right', [4, 5, 6], 10, true);
        game.physics.arcade.enable(this.player);
        this.player.body.collideWorldBounds = true;
        this.btn.fixedToCamera = true;
        this.btn.inputEnabled = true;
        this.btn1.inputEnabled = true;
        this.btn1.fixedToCamera = true;
        this.btn3.inputEnabled = true;
        this.btn.events.onInputDown.add(this.funcup);
        this.btn1.events.onInputDown.add(this.funcdown);
        this.btn.events.onInputUp.add(this.stopleft);
        this.btn1.events.onInputUp.add(this.stopleft);
        this.btn3.events.onInputDown.add(this.funcfire);
        this.player.body.immovable = true;
        this.player.body.collideWorldBounds = true;
        this.mushroom = game.add.group();
        this.mushroom.enableBody = true;
        this.mushroom.physicsBodyType = Phaser.Physics.ARCADE;
        this.text = game.add.text(0, 0, "HP:" + this.hp, {
            font: "32px Arial",
            fill: "#ff0000",
            align: "center"
        })
        this.laser = game.add.group();
        this.laser.enableBody = true;
        this.laser.physicsBodyType = Phaser.Physics.ARCADE;
        this.plat = game.add.group();
        this.plat.enableBody = true;
        this.plat.physicsBodyType = Phaser.Physics.ARCADE;
        for (var i = 0; i < 20; i++) {
            var bullet = this.laser.create(0, 0, 'laser');
            bullet.name = 'laser' + i;
            bullet.exists = false;
            bullet.visible = false;
            bullet.checkWorldBounds = true;
            bullet.events.onOutOfBounds.add(this.resetBullet, this);
        }

        game.time.events.loop(Phaser.Timer.SECOND * 2, this.createMush, this);
    },
    createMush: function () {
        for (var i = 0; i < level1.case.length; i++) {
            var mushroom = this.mushroom.create(game.world.width - 200, game.world.randomY, level1.case[i]);
            mushroom.scale.setTo(1);
            mushroom.body.immovable = true;
        }

    },
    update: function () {
        game.world.wrap(this.player, 0, true);
        game.physics.arcade.collide(this.mushroom, this.player, this.touchfunc);
        game.physics.arcade.collide(this.laser, this.mushroom, this.touchfunc2);
        for (var i = 0; i < this.mushroom.children.length; i++) {
            game.physics.arcade.moveToObject(this.mushroom.children[i], this.player, 60, 5000);
        }

    },
    resetBullet: function (bullet) {
        bullet.kill();
    },
    funcfire: function () {
        if (game.time.now > level1.bulletTime) {
            var bullet = level1.laser.getFirstExists(false);

            if (bullet) {
                bullet.reset(level1.player.y + 1, level1.player.y - 4);
                bullet.body.velocity.x = 200;
                level1.bulletTime = game.time.now + 150;
            }
        }
    },

    touchfunc: function (a, b) {
        level1.hp--;
        b.kill();
        level1.text.text = "HP" + level1.hp
        if (level1.hp == 0) {
            game.state.start("lev1");
            level1.hp = 3;
        }
    },
    touchfunc2: function (bullet, mushroom) {
        bullet.kill();
        mushroom.kill();
    },
    funcleft: function () {
        level1.mushroom.body.velocity.x = -900;
        level1.mushroom.animations.play('left');
    },
    funcup: function () {
        level1.player.body.velocity.y = -300;
        level1.player.animations.play('left');
    },
    funcdown: function () {
        level1.player.body.velocity.y = 300;
        level1.player.animations.play('right');
    },
    stopleft: function () {
        level1.player.body.velocity.x = 0;
        level1.player.body.velocity.y = 00;
        level1.player.animations.stop();
        level1.player.frame = 3;
    },
};
