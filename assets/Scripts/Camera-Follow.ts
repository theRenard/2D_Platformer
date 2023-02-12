import { _decorator, Component, Node, Vec3, v2, Vec2, v3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Camera_Follow')
export class Camera_Follow extends Component {
    @property(Node) target: Node = null;

    smoothSpeed: number = 0.05;
    maxLowerPoint = -158;

    // update(deltaTime: number) {
    //     const y = this.target.position.y;
    //     const possibleY = y < this.maxLowerPoint ? this.maxLowerPoint : y;
    //     const desiredPosition = v3(this.target.position.x * deltaTime * 10, possibleY, this.target.position.z);
    //     const position = v3();
    //     Vec3.lerp(position, this.node.position, desiredPosition, this.smoothSpeed);
    //     this.node.position = position;

    // }
    lateUpdate(deltaTime: number) {
        const desiredPosition = v3(this.target.position.x, this.target.position.y, this.target.position.z);
        // const position = v3();
        // Vec3.lerp(position, this.node.position, desiredPosition, this.smoothSpeed);
        this.node.position = desiredPosition;

    }
}

