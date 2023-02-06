import { BaseResolver, ResolverType } from "@app/core/editor/resolvers/base.resolver";
import { AlignmentResolver } from "@app/core/editor/resolvers/alignment.resolver";
import { FontMiscResolver, FontResolver } from "@app/core/editor/resolvers/font.resolver";
import {
    ObjectStrokeResolver
} from "@app/modules/pages/editor/components/actions/object/object-stroke/object-stroke.resolver";
import {
    ObjectShadowResolver
} from "@app/modules/pages/editor/components/actions/object/object-shadow/object-shadow.resolver";
import { ClipPathResolver } from "@app/core/editor/resolvers/clippath.resolver";
import { CircleResolver } from "@app/core/editor/resolvers/circle.resolver";
import { RectResolver } from "@app/core/editor/resolvers/rect.resolver";
import {
    ObjectOpacityResolver
} from "@app/modules/pages/editor/components/actions/object/object-opacity/object-opacity.resolver";
import {
    FontTransformResolver
} from '@app/modules/pages/editor/components/actions/object/font-transform/font-transform.resolver';

const _RESOLVERS: BaseResolver[] = [
    new FontMiscResolver(),
    new FontResolver(),
    new AlignmentResolver(),
    new ObjectStrokeResolver(),
    new ObjectShadowResolver(),
    new ObjectOpacityResolver(),
    new ClipPathResolver(),
    new FontTransformResolver()
];

export const TEXT_RESOLVERS: BaseResolver[] = _RESOLVERS.filter(r => r.resolverType === ResolverType.TEXT);
export const OBJECT_RESOLVERS: BaseResolver[] = _RESOLVERS.filter(r => r.resolverType === ResolverType.OBJECT);

export const CIRCLE_RESOLVERS = new CircleResolver();
export const RECT_RESOLVERS = new RectResolver();
