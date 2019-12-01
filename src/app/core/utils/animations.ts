import {animate, animateChild, group, query, style, transition, trigger} from "@angular/animations";


const steps = [
    style({position: 'relative'}),
    query(':enter, :leave', [
        style({
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%'
        })
    ]),
    query(':enter', [
        style({left: '-100%'})
    ]),
    query(':leave', animateChild(), {optional: true}),
    group([
        query(':leave', [
            animate('200ms ease-out', style({left: '100%'}))
        ], {optional: true}),
        query(':enter', [
            animate('300ms ease-out', style({left: '0%'}))
        ])
    ]),
    query(':enter', animateChild()),
];

export const slideInAnimation =
    trigger('routeAnimations', [
        transition('* <=> Page1', steps),
        transition('* <=> Page2', steps),
        transition('* <=> Page3', steps),
        transition('* <=> Page4', steps)
    ]);
