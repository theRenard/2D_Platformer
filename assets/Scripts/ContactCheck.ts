import { _decorator, Component, Node, BoxCollider2D, PhysicsSystem2D, PolygonCollider2D, IPhysics2DContact, UITransform, math, Graphics, Collider2D, Vec2, Vec3, color, Color } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ContactCheck')
export class ContactCheck extends Component {

    public hasContact: boolean = false;
    private rectangle: math.Rect = null;
    private debugRectangle: math.Rect = null;
    private uiTransform: UITransform = null;
    private graphics: Graphics = null;
    @property debug = false;

    start() {
        this.rectangle = new math.Rect();
        this.uiTransform = this.node.getComponent(UITransform);
        if (this.debug) {
            this.debugRectangle = new math.Rect();
            this.graphics = this.node.addComponent(Graphics);
        }
    }

    setRectangle() {
        const { x, y } = this.node.getWorldPosition();
        const { width, height } = this.uiTransform.contentSize;
        this.rectangle.set(x - (width / 2), y - (height / 2), width, height);
    }

    setDebugRectangle() {
        const localPos = new Vec3();
        const worldPosition = this.node.getWorldPosition();
        const { width, height } = this.uiTransform.contentSize;
        this.uiTransform.convertToNodeSpaceAR(worldPosition, localPos);
        this.debugRectangle.set(localPos.x - (width / 2), localPos.y - (height / 2), width, height);
    }

    checkCollision() {
        const contacts = PhysicsSystem2D.instance.testAABB(this.rectangle);
        const hasContact = contacts.some((contact: Collider2D) => contact.name === "TilemapCollider");
        this.hasContact = hasContact;
    }

    debugGraphics() {
        this.graphics.clear();
        this.graphics.fillColor = this.hasContact ? Color.RED : Color.GREEN;
        this.graphics.rect(this.debugRectangle.x, this.debugRectangle.y, this.debugRectangle.width, this.debugRectangle.height);
        this.graphics.fill();
    }

    update(deltaTime: number) {
        this.setRectangle();
        this.checkCollision();
        if (this.debug) {
            console.log(`${this.node.name} has contact`, this.hasContact);
            this.setDebugRectangle();
            this.debugGraphics();
        }
    }
}

