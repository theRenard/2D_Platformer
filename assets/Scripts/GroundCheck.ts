import { _decorator, Component, Node, BoxCollider2D, PhysicsSystem2D, PolygonCollider2D, IPhysics2DContact, UITransform, math, Graphics, Collider2D } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GroundCheck')
export class GroundCheck extends Component {

    public isGrounded: boolean = false;
    private rectangle: math.Rect = null;
    private uiTransform: UITransform = null;

    start() {
        this.rectangle = new math.Rect();
        this.uiTransform = this.node.getComponent(UITransform);
    }

    setRectangle() {
        const { x, y } = this.node.getWorldPosition();
        const { width, height } = this.uiTransform.contentSize;
        this.rectangle.set(x - width / 2, y - height / 2, width, height);
    }

    checkCollision() {
        const contacts = PhysicsSystem2D.instance.testAABB(this.rectangle);
        const hasContact = contacts.some((contact: Collider2D) => contact.name === "TilemapCollider");
        this.isGrounded = hasContact;
    }

    update(deltaTime: number) {
        this.setRectangle();
        this.checkCollision();
    }
}

