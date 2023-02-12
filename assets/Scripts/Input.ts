import { _decorator, Component, input, Input as _Input, EventKeyboard, KeyCode } from 'cc';
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

    horizontalValue: number = 0;
    verticalValue: number = 0;
    jumpButton: boolean = false;

    start() {
        input.on(_Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.on(_Input.EventType.KEY_UP, this.onKeyUp, this);
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
}

