import { _decorator, Component, Node, Animation, AnimationClip,Color,director,log,Label } from 'cc';
import { UIConstant } from 'db://assets/constants/UIConstant';
import { jumpPath } from "db://assets/enums/UIEnum";
const { ccclass, property } = _decorator;

@ccclass('UIScript')
export class UIScript extends Component {
    @property(Node)
    startBtn: Node = null!;

    @property(Node)
    settingBtn: Node = null!;

    @property(Node)
    exitBtn: Node = null!;
    private normalColor = UIConstant.NORMAL_COLOR;   // 未选中
    private normalOutlineColor = UIConstant.NORMAL_OUTLINE_COLOR;
    private normalFontSize = UIConstant.NORMAL_FONT_SIZE;
    private hoverColor = UIConstant.HOVER_COLOR;    // 选中状态
    private hoverOutlineColor = UIConstant.HOVER_OUTLINE_COLOR;
    private hoverFontSize = UIConstant.HOVER_FONT_SIZE;
    start() {
        this.initButtonHover(this.startBtn);
        this.initButtonHover(this.settingBtn);
        this.initButtonHover(this.exitBtn);
        //跳转实现
        this.jumpClick(this.startBtn,jumpPath.start);
        this.jumpClick(this.settingBtn,jumpPath.setting);
        this.jumpClick(this.exitBtn,jumpPath.exit);
    }
    update(deltaTime: number) {

    }

    /**
     * 给按钮绑定悬停变色效果
     * @param btn 按钮节点
     */
    private initButtonHover(btn: Node) {
        // 鼠标进入 → 选中状态
        btn.on(Node.EventType.MOUSE_ENTER, () => {
            this.setNodeColor(btn, this.hoverColor,this.hoverOutlineColor,this.hoverFontSize);
        });

        // 鼠标离开 → 恢复原色
        btn.on(Node.EventType.MOUSE_LEAVE, () => {
            this.setNodeColor(btn, this.normalColor,this.normalOutlineColor,this.normalFontSize);
        });
    }

    private setNodeColor(node: Node, color: Color, outlineColor: Color, fontSize: number) {
        // 如果是文字按钮
        const label = node.getComponent(Label);
        if (label) {
            label.color = color;
            label.fontSize = fontSize;
            label.outlineColor = outlineColor;
        }
    }

    private jumpClick(logicNode: Node , path: jumpPath) {
        if(!logicNode) return;
        // MOUSE_UP：按下并抬起时触发（避免拖拽时误触）
        logicNode.on(Node.EventType.MOUSE_UP, () => {
            director.loadScene(path); // 跳转到名为 "GameScene" 的场景
            log("切换到:"+ path);
        })
    }
}

