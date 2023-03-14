import { _decorator, Component, input, Input as _Input, EventKeyboard, KeyCode, EventGamepad } from 'cc';
const { ccclass, property } = _decorator;

export enum Directions {
    Horizontal = "Horizontal",
    Vertical = "Vertical"
}

export enum Buttons {
    Jump = "Jump",
}

@ccclass('Input')
export class Input extends Component {

    @property gamepadDeadZone = 0.2;
    @property jumpOnce = true;
    @property jumpOnceDelay = 0.08;
    horizontalValue: number = 0;
    verticalValue: number = 0;
    jumpButton: boolean = false;

    start() {
        input.on(_Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.on(_Input.EventType.KEY_UP, this.onKeyUp, this);
        input.on(_Input.EventType.GAMEPAD_INPUT, this.gamepadInput, this);

    }

    private onKeyDown(event: EventKeyboard) {
        console.log('down', event.keyCode);
        switch (event.keyCode) {
            case KeyCode.ARROW_LEFT:
                this.horizontalValue = -1;
                break;
            case KeyCode.ARROW_RIGHT:
                this.horizontalValue = 1;
                break;
            case KeyCode.ARROW_UP:
                this.verticalValue = 1;
                break;
            case KeyCode.ARROW_DOWN:
                this.verticalValue = -1;
                break;
            case KeyCode.SPACE:
                this.jumpButton = true;
                this.resetJump();
                break;
        }
    }

    private onKeyUp(event: any) {
        console.log('up', event.keyCode);
        switch (event.keyCode) {
            case KeyCode.ARROW_LEFT:
                this.horizontalValue = 0;
                break;
            case KeyCode.ARROW_RIGHT:
                this.horizontalValue = 0;
                break;
            case KeyCode.ARROW_UP:
                this.verticalValue = 0;
                break;
            case KeyCode.ARROW_DOWN:
                this.verticalValue = 0;
                break;
            case KeyCode.SPACE:
                this.jumpButton = false;
        }
    }

    private resetJump() {
        if (this.jumpOnce) {
            this.scheduleOnce(() => {
                this.jumpButton = false;
            }, this.jumpOnceDelay);
        }
    }

    private gamepadInput(e: EventGamepad) {
        const gp = e.gamepad;
        const { x, y } = gp.leftStick.getValue();
        const a = gp.buttonSouth.getValue();
        if (a === 1) this.jumpButton = true;
        if (a === 0) this.jumpButton = false;
        if (x !== 0 || y !== 0) {
          const xDir = x > this.gamepadDeadZone || x < -this.gamepadDeadZone ? x : 0;
          const yDir = y > this.gamepadDeadZone || y < -this.gamepadDeadZone ? y : 0;
            this.horizontalValue = xDir;
            this.verticalValue = yDir;
        }
      }

    getButtonDown(button: Buttons) {
        switch (button) {
            case Buttons.Jump:
                return this.jumpButton;
        }
    }

    getAxisRaw(axis: Directions) {
        switch (axis) {
            case Directions.Horizontal:
                return this.horizontalValue;
            case Directions.Vertical:
                return this.verticalValue;
        }
    }

    forceJumpKeyUp() {
        this.jumpButton = false;
    }
 }

