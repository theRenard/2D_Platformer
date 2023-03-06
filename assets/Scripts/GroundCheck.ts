import { _decorator, Component, Node, BoxCollider2D, Contact2DType, PolygonCollider2D, IPhysics2DContact } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GroundCheck')
export class GroundCheck extends Component {

    public isGrounded: boolean = false;
    private circleCollider: BoxCollider2D = null;

    start() {
        this.circleCollider = this.getComponent(BoxCollider2D);
        this.circleCollider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        this.circleCollider.on(Contact2DType.END_CONTACT, this.onEndContact, this);
    }

    private onBeginContact(selfCollider: BoxCollider2D, otherCollider: PolygonCollider2D, contact: IPhysics2DContact | null) {
        this.isGrounded = true;
        console.log('grounded');
    }

    private onEndContact(selfCollider: BoxCollider2D, otherCollider: PolygonCollider2D, contact: IPhysics2DContact | null) {
        this.isGrounded = false;
        console.log('not grounded');
    }

    update(deltaTime: number) {

    }
}

