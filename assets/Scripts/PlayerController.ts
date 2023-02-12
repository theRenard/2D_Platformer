import { _decorator, Component, Node, RigidBody2D, Vec2, Vec3 } from 'cc';
import { Input, Directions, Buttons } from './Input';
const { ccclass, property, executionOrder } = _decorator;

@ccclass('PlayerController')
@executionOrder(-1)
export class PlayerController extends Component {

    private rb: RigidBody2D = null;
    private movementInputDirection: number = 0;
    private input: Input = null;
    private isFacingRight: boolean = true;
    public movementSpeed: number = 10;
    public jumpForce: number = 16;

    onLoad() {
        this.rb = this.getComponent(RigidBody2D);
        this.input = this.getComponent(Input);
    }

    private checkMovementDirection() {
        if (this.movementInputDirection < 0 && this.isFacingRight) {
            this.flip();
        } else if (this.movementInputDirection > 0 && !this.isFacingRight) {
            this.flip();
        }
    }

    private flip() {
        this.isFacingRight = !this.isFacingRight;
        this.node.scale = new Vec3(-this.node.scale.x, 1);
    }

    private jump() {
        this.rb.linearVelocity = new Vec2(this.rb.linearVelocity.x, this.jumpForce);
    }

    private checkInput() {
        this.movementInputDirection = this.input.getAxisRaw(Directions.Horizontal);

        if (this.input.getButtonDown(Buttons.Jump)) {
            this.jump();
        }
    }

    private applyMovement() {
        this.rb.linearVelocity = new Vec2(this.movementInputDirection * this.movementSpeed, this.rb.linearVelocity.y);
    }

    update() {
        this.checkInput();
        this.applyMovement();
        this.checkMovementDirection();
    }

}

