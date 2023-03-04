import { _decorator, Component, Node, RigidBody2D, Vec2, Vec3, AnimationComponent, animation, Animation } from 'cc';
import { Input, Directions, Buttons } from './Input';
const { ccclass, property, executionOrder } = _decorator;
import { Camera_Follow } from './Camera-Follow';

@ccclass('PlayerController')
export class PlayerController extends Component {

    private cameraFollow: Camera_Follow = null;
    private rb: RigidBody2D = null;
    private movementInputDirection: number = 0;
    private input: Input = null;
    private spriteNode: Node = null;
    private isWalking: boolean = false;
    private isFacingRight: boolean = true;
    public movementSpeed: number = 10;
    public jumpForce: number = 16;
    private animationController: animation.AnimationController = null;

    onLoad() {
        this.spriteNode = this.node.getChildByName('Sprite');
        this.rb = this.getComponent(RigidBody2D);
        this.input = this.getComponent(Input);
        this.cameraFollow = this.getComponent(Camera_Follow);
        this.animationController = this.spriteNode.getComponent(animation.AnimationController);
        console.log(this.spriteNode);
        console.log(this.animationController);
    }

    private checkMovementDirection() {
        if (this.movementInputDirection < 0 && this.isFacingRight) {
            this.flip();
        } else if (this.movementInputDirection > 0 && !this.isFacingRight) {
            this.flip();
        }
        if (this.rb.linearVelocity.x != 0) {
            this.isWalking = true;
        } else {
            this.isWalking = false;
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

    private updateAnimations() {
        this.animationController.setValue('isWalking', this.isWalking);
    }

    private applyMovement() {
        this.rb.linearVelocity = new Vec2(this.movementInputDirection * this.movementSpeed, this.rb.linearVelocity.y);
    }

    update() {
        this.checkInput();
        this.applyMovement();
        this.checkMovementDirection();
        this.updateAnimations();
        // this.cameraFollow.updateCameraPosition(this.node.getPosition());
    }

    lateUpdate() {
        // this.cameraFollow.updateCameraPosition(this.node.getPosition());
    }

}

