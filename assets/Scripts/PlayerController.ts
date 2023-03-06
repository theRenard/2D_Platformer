import { _decorator, Component, Node, RigidBody2D, Vec2, Vec3, AnimationComponent, animation, Animation, PhysicsSystem2D } from 'cc';
import { Input, Directions, Buttons } from './Input';
const { ccclass, property, executionOrder } = _decorator;
import { Camera_Follow } from './Camera-Follow';
import { GroundCheck } from './GroundCheck';

@ccclass('PlayerController')
export class PlayerController extends Component {

    private cameraFollow: Camera_Follow = null;
    private rb: RigidBody2D = null;
    private animationController: animation.AnimationController = null;
    private input: Input = null;

    private movementInputDirection: number = 0;
    private spriteNode: Node = null;
    private isWalking: boolean = false;
    private isFacingRight: boolean = true;
    public movementSpeed: number = 10;
    public groundCheck: GroundCheck = null;

    public jumpForce: number = 16;
    private canJump: boolean = true;
    private isGrounded: boolean = false;

    public maxAmmountOfJumps: number = 2;
    private currentAmmountOfJumps: number = 0;

    onLoad() {
        this.spriteNode = this.node.getChildByName('Sprite');
        this.groundCheck = this.node.getComponent(GroundCheck);
        this.rb = this.getComponent(RigidBody2D);
        this.input = this.getComponent(Input);
        this.cameraFollow = this.getComponent(Camera_Follow);
        this.animationController = this.spriteNode.getComponent(animation.AnimationController);
        this.currentAmmountOfJumps = this.maxAmmountOfJumps;
        console.log('player controller loaded');
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

    private checkIfIsGrounded() {
        this.isGrounded = this.groundCheck.isGrounded;
    }

    private checkIfCanJump() {
        if (this.isGrounded && this.rb.linearVelocity.y <= 0) {
            this.currentAmmountOfJumps = this.maxAmmountOfJumps;
        }

        if (this.currentAmmountOfJumps <= 0) {
            this.canJump = false;
        } else {
            this.canJump = true;
        }
    }

    private flip() {
        this.isFacingRight = !this.isFacingRight;
        this.node.scale = new Vec3(-this.node.scale.x, 1);
    }

    private jump() {
        if (this.canJump) {
            this.rb.linearVelocity = new Vec2(this.rb.linearVelocity.x, this.jumpForce);
            this.currentAmmountOfJumps--;
        }

    }

    private checkInput() {
        this.movementInputDirection = this.input.getAxisRaw(Directions.Horizontal);

        if (this.input.getButtonDown(Buttons.Jump)) {
            this.jump();
        }
    }

    private updateAnimations() {
        this.animationController.setValue('isWalking', this.isWalking);
        this.animationController.setValue('isGrounded', this.isGrounded);
        this.animationController.setValue('yVelocity', this.rb.linearVelocity.y);
    }

    private applyMovement() {
        this.rb.linearVelocity = new Vec2(this.movementInputDirection * this.movementSpeed, this.rb.linearVelocity.y);
    }

    update() {
        this.checkIfIsGrounded();
        this.checkInput();
        this.checkIfCanJump();
        this.applyMovement();
        this.checkMovementDirection();
        this.updateAnimations();
        console.log(this.rb.linearVelocity.y);
        // this.cameraFollow.updateCameraPosition(this.node.getPosition());
    }

    lateUpdate() {
        // this.cameraFollow.updateCameraPosition(this.node.getPosition());
    }

}

