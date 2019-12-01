import {Component, HostBinding, Input} from '@angular/core';

@Component({
    selector: 'app-action-bubble',
    templateUrl: './action-bubble.component.html',
    styleUrls: ['./action-bubble.component.scss']
})
export class ActionBubbleComponent {
    @Input()
    @HostBinding('class')
    size: 'smaller' | '' = ''; // TODO: if we set small as host class it will also affect child components which uses host-context

    constructor() {
    }
}
