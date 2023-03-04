import { _decorator, Component, Node, Vec3, v2, Vec2, v3, Camera, UITransform } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Camera_Follow')
export class Camera_Follow extends Component {
    @property({ type: Node }) target: Node = null;

    @property follow = false;

    smoothSpeed: number = 0.05;
    maxLowerPoint = -158;

    update(deltaTime: number) {
        if (!this.target) return;
        if (!this.follow) return;
        const y = this.target.position.y;
        const possibleY = y < this.maxLowerPoint ? this.maxLowerPoint : y;
        const desiredPosition = v3(this.target.position.x * deltaTime * 10, possibleY, this.target.position.z);
        const position = v3();
        Vec3.lerp(position, this.node.position, desiredPosition, this.smoothSpeed);
        this.node.position = position;
    }
}

