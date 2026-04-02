import { _decorator, Component, Node, UITransform, Vec2, director,log,resources,SpriteFrame,Sprite,error} from 'cc';
import {selectedRole, jumpPath, bthHover} from 'db://assets/enums/SelectEnum'
const { ccclass, property } = _decorator;

@ccclass('SelectScript')
export class SelectScript extends Component {
    @property(Node)
    role_human: Node = null;
    @property(Node)
    role_orc: Node = null;
    @property(Node)
    role_elf: Node = null;
    @property(Node)
    role_undead: Node = null;

    //mask 节点
    @property(Node)
    maskNode: Node = null;

    //跳转路由按钮
    @property(Node)
    backNode: Node = null;
    @property(Node)
    nextNode: Node = null;

    start() {
        this.bindRoleClick(this.role_human, selectedRole.human);
        this.bindRoleClick(this.role_orc, selectedRole.orc);
        this.bindRoleClick(this.role_elf, selectedRole.elf);
        this.bindRoleClick(this.role_undead, selectedRole.undead);
        //先按 human 的效果初始化
        if (this.role_human) this.setMaskAnchorX(2);
        this.jumpClick(this.backNode,jumpPath.back);
        this.jumpClick(this.nextNode,jumpPath.next);
        this.initBtnHover(this.backNode,bthHover.back_hover,bthHover.back);
        this.initBtnHover(this.nextNode,bthHover.next_hover,bthHover.next);

    }

    update(deltaTime: number) {
        
    }

    private bindRoleClick(role: Node | null, anchorX: number) {
        if (!role) return;
        // MOUSE_UP：按下并抬起时触发（避免拖拽时误触）
        role.on(Node.EventType.MOUSE_UP, () => {
            this.setMaskAnchorX(anchorX);
            log("切换到:"+ role.name)
        });
    }
    private setMaskAnchorX(anchorX: number) {
        if (!this.maskNode) return;
        const uiTrans = this.maskNode.getComponent(UITransform);
        if (!uiTrans) return;
        uiTrans.anchorPoint = new Vec2(anchorX, uiTrans.anchorPoint.y);
    }

    private jumpClick(logicNode: Node , path: jumpPath) {
        if(!logicNode) return;
        // MOUSE_UP：按下并抬起时触发（避免拖拽时误触）
        logicNode.on(Node.EventType.MOUSE_UP, () => {
            director.loadScene(path); // 跳转到名为 "GameScene" 的场景
            log("切换到:"+ path);
        })
    }

    private initBtnHover(logicNode: Node, path_hover: bthHover,path: bthHover) {
        // 鼠标进入：切换为 hover 图
        logicNode.on(Node.EventType.MOUSE_ENTER, () => {
            this.loadSprite(logicNode, path_hover);
        });

        // 鼠标离开：切换为正常图
        logicNode.on(Node.EventType.MOUSE_LEAVE, () => {
            this.loadSprite(logicNode, path);
        });
    }

    private loadSprite(node: Node, path: string) {
        const sprite = node.getComponent(Sprite);
        if (!sprite) {
            error(`节点 ${node.name} 没有 Sprite 组件！`);
            return;
        }
        resources.load(`${path}/spriteFrame`, SpriteFrame, (err, spriteFrame) => {
            if (err) {
                error(`加载资源失败: ${path}`, err);
                return;
            }
            if (spriteFrame) {
                sprite.spriteFrame = spriteFrame;
            }
        });
    }
}


