
import { Sprite } from 'cc';
import { SpriteFrame } from 'cc';
import { Asset } from 'cc';
import { _decorator, Component, Node } from 'cc';
import { Texture2D } from 'cc';
import { isValid } from 'cc';
import { ImageAsset } from 'cc';
import SuperGif from './libgif';
const { ccclass, property } = _decorator;

@ccclass('BigWorldBuildingGif')
export class BigWorldBuildingGif extends Component {
    @property({
        serializable: true
    })
    _asset: Asset = null;
    @property(Asset)
    get asset() {
        return this._asset;
    }
    set asset(val) {
        if (this._asset === val) {
            return;
        }
        this._asset = val;
        this.refresh();
    }

    _face: Sprite = null;
    @property(Sprite)
    get face() {
        if (!this._face) {
            this._face = this.node.getComponent(Sprite) || this.node.addComponent(Sprite);
        }
        return this._face;
    }
    @property
    interval = 0.1;
    cd = 0;

    frameList: SpriteFrame[] = [];
    frameInd = 0;
    protected _inited = false;
    get inited() {
        return this._inited;
    }

    protected start(): void {
        this.refresh();
    }
    async refresh() {
        this._inited = false;
        this.frameList = [];
        if (!this.assetIsGif(this._asset)) {
            return;
        }
        let gif = new Image();
        gif.src = this._asset.nativeUrl;
        await new Promise<Event>((ok, fail) => {
            gif.onload = ok;
            gif.onerror = fail;
        });
        let superGif = new SuperGif({ gif: gif });
        await superGif.load();
        for (let i = 0; i <= superGif.getLength(); i++) {
            superGif.moveTo(i);
            let oldCanvas = superGif.getCanvas();
            if (!oldCanvas || oldCanvas.width <= 0 || oldCanvas.height <= 0) {
                console.warn('GIF帧Canvas无效，跳过');
                continue;
            }
            let canvas = document.createElement('canvas');
            canvas.width = oldCanvas.width;
            canvas.height = oldCanvas.height;
            canvas.getContext('2d').drawImage(oldCanvas, 0, 0);

            let tex = new Texture2D();
            let imgAsset = new ImageAsset(canvas); // 用canvas创建ImageAsset
            tex.image = imgAsset; // 赋值给Texture2D
            let spriteFrame = new SpriteFrame();
            spriteFrame.texture = tex;
            this.frameList.push(spriteFrame);
        }
        superGif.destroy();
        superGif = null;
        this._inited = true;

        this._setFrame(0);
    }
    assetIsGif(asset: Asset) {
        if (!isValid(asset)) {
            return false;
        }
        return /gif/g.test(this._asset.nativeUrl.substring(this._asset.nativeUrl.lastIndexOf(".")));
    }
    protected _setFrame(ind: number) {
        this.face.spriteFrame = this.frameList[ind];
    }
    protected lateUpdate(dt: number): void {
        if (!this._inited) {
            return;
        }
        this.cd += dt;
        if (this.cd > this.interval) {
            this.cd = 0;
            this.frameInd++;
            if (this.frameInd >= this.frameList.length) {
                this.frameInd = 0;
            }
            this._setFrame(this.frameInd);
        }
    }
}


