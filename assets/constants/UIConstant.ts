import { Color } from 'cc';

/**
 * UI 通用常量配置
 * 统一管理按钮颜色、字号、描边等常量
 */
export class UIConstant {
    // 按钮 未选中/正常状态
    public static readonly NORMAL_COLOR = new Color(255, 255, 255, 255);
    public static readonly NORMAL_OUTLINE_COLOR = new Color(36, 36, 36, 255);
    public static readonly NORMAL_FONT_SIZE = 30;

    // 按钮 悬停/选中状态
    public static readonly HOVER_COLOR = new Color(255, 215, 0, 255);
    public static readonly HOVER_OUTLINE_COLOR = new Color(36, 36, 36, 255);
    public static readonly HOVER_FONT_SIZE = 32;
}