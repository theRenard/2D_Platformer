import { _decorator, Component, Node, RigidBody2D, Vec2, Vec3, EPhysics2DDrawFlags, animation, Animation, PhysicsSystem2D } from 'cc';
import { Input, Directions, Buttons } from './Input';
const { ccclass, property, executionOrder } = _decorator;
import { Camera_Follow } from './Camera-Follow';
import { ContactCheck } from './ContactCheck';

@ccclass('PlayerController')
export class PlayerController extends Component {

    private cameraFollow: Camera_Follow = null;
    private rb: RigidBody2D = null;
    private animationController: animation.AnimationController = null;
    private input: Input = null;
    private facingDirection: number = 1;

    private movementInputDirection: number = 0;
    private spriteNode: Node = null;
    private isWalking: boolean = false;
    private isFacingRight: boolean = true;
    public movementSpeed: number = 10;
    private groundCheck: ContactCheck = null;
    private wallCheck: ContactCheck = null;

    public jumpForce: number = 16;
    private canJump: boolean = true;
    private isGrounded: boolean = false;
    private isTouchingWall: boolean = false;
    private isWallSliding: boolean = false;

    private wallHopDirection: Vec2 = new Vec2(1, 1);
    private wallJumpDirection: Vec2 = new Vec2(1, 1);
    private wallHopForce: number = 3;
    private wallJumpForce: number = 5;

    public wallSlideSpeed: number = 2;
    public maxAmmountOfJumps: number = 2;
    private amountOfJumpsLeft: number = 0;
    private movementForceInAir: number = 5;
    private airDragMultiplier: number = 0.95;

    onLoad() {
        this.spriteNode = this.node.getChildByName('Sprite');
        const groundCheckNode = this.node.getChildByName('GroundCheck');
        const wallCheckNode = this.node.getChildByName('WallCheck');
        this.groundCheck = groundCheckNode.getComponent(ContactCheck);
        this.wallCheck = wallCheckNode.getComponent(ContactCheck);
        this.rb = this.getComponent(RigidBody2D);
        this.input = this.getComponent(Input);
        this.cameraFollow = this.getComponent(Camera_Follow);
        this.animationController = this.spriteNode.getComponent(animation.AnimationController);
        this.amountOfJumpsLeft = this.maxAmmountOfJumps;
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

    private checkSurroundings() {
        this.isGrounded = this.groundCheck.hasContact;
        this.isTouchingWall = this.wallCheck.hasContact;
    }

    private checkIfCanJump() {
        if ((this.isGrounded && this.rb.linearVelocity.y <= 0) || this.isWallSliding) {
            this.amountOfJumpsLeft = this.maxAmmountOfJumps;
        }

        if (this.amountOfJumpsLeft <= 0) {
            // console.log('can Jumps set to false');
            this.canJump = false;
        } else {
            // console.log('can Jumps set to true');
            this.canJump = true;
        }
    }

    private flip() {
        if (!this.isWallSliding) {
            this.facingDirection *= -1;
            this.isFacingRight = !this.isFacingRight;
            this.node.scale = new Vec3(-this.node.scale.x, 1);
        }
    }

    private jump() {
        if (this.canJump && !this.isWallSliding) {
            console.log('jump');
            this.rb.linearVelocity = new Vec2(this.rb.linearVelocity.x, this.jumpForce);
            this.amountOfJumpsLeft--;
        }
        else if (this.isWallSliding && this.movementInputDirection == 0 && this.canJump) { // wall hop
            console.log('wall hop');
            this.isWallSliding = false;
            this.amountOfJumpsLeft--;
            const forceToAdd = new Vec2(this.wallHopDirection.x * this.wallHopForce * -this.facingDirection, this.wallHopDirection.y * this.wallHopForce);
            console.log(forceToAdd);
            this.rb.applyLinearImpulseToCenter(forceToAdd, true);
        }
        else if ((this.isWallSliding || this.isTouchingWall) && this.movementInputDirection != 0 && this.canJump) { // wall jump
            console.log('wall jump');
            this.isWallSliding = false;
            this.amountOfJumpsLeft--;
            const forceToAdd = new Vec2(this.wallJumpDirection.x * this.wallJumpForce * -this.facingDirection, this.wallJumpDirection.y * this.wallJumpForce);
            console.log(forceToAdd);
            this.rb.applyLinearImpulseToCenter(forceToAdd, true);
        }
    }

    private checkInput() {
        this.movementInputDirection = this.input.getAxisRaw(Directions.Horizontal);

        if (this.input.getButtonDown(Buttons.Jump)) {
            this.jump();
            this.input.forceJumpKeyUp();
        }
    }

    private checkIfWallSliding() {
        if (this.isTouchingWall && !this.isGrounded && this.rb.linearVelocity.y < 0) {
            this.isWallSliding = true;
        } else {
            this.isWallSliding = false;
        }
    }



    private updateAnimations() {
        this.animationController.setValue('isWalking', this.isWalking);
        this.animationController.setValue('isGrounded', this.isGrounded);
        this.animationController.setValue('yVelocity', this.rb.linearVelocity.y);
        this.animationController.setValue('isWallSliding', this.isWallSliding);
    }

    private applyMovement() {

        if (this.isGrounded) {
            this.rb.linearVelocity = new Vec2(this.movementInputDirection * this.movementSpeed, this.rb.linearVelocity.y);
        }

        else if (!this.isGrounded && !this.isWallSliding && this.movementInputDirection != 0) {
            const forceToAdd = new Vec2(this.movementInputDirection * this.movementForceInAir, 0);
            this.rb.applyLinearImpulseToCenter(forceToAdd, true);

            if (Math.abs(this.rb.linearVelocity.x) > this.movementSpeed) {
                this.rb.linearVelocity = new Vec2(this.movementInputDirection * this.movementSpeed, this.rb.linearVelocity.y);
            }
        }

        else if (!this.isGrounded && !this.isWallSliding && this.movementInputDirection == 0) {
            this.rb.linearVelocity = new Vec2(this.rb.linearVelocity.x * this.airDragMultiplier, this.rb.linearVelocity.y);
        }

        if (this.isWallSliding) {

            if (this.rb.linearVelocity.y < -this.wallSlideSpeed) {
                this.rb.linearVelocity = new Vec2(this.rb.linearVelocity.x, -this.wallSlideSpeed);
            }

        }
    }

    update() {
        this.checkSurroundings();
        this.checkIfCanJump();
        this.checkIfWallSliding();
        this.checkInput();
        this.applyMovement();
        this.checkMovementDirection();
        this.updateAnimations();

        // console.log(this.rb.linearVelocity.y);
        // this.cameraFollow.updateCameraPosition(this.node.getPosition());
    }

    lateUpdate() {
        // this.cameraFollow.updateCameraPosition(this.node.getPosition());
    }

}

