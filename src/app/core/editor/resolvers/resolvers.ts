import {BaseResolver, ResolverType} from "@app/core/editor/resolvers/base.resolver";
import {AlignmentResolver} from "@app/core/editor/resolvers/alignment.resolver";
import {FontMiscResolver, FontResolver} from "@app/core/editor/resolvers/font.resolver";
import {ObjectStrokeResolver} from "@app/modules/pages/editor/components/actions/object/object-stroke/object-stroke.resolver";
import {ObjectShadowResolver} from "@app/modules/pages/editor/components/actions/object/object-shadow/object-shadow.resolver";

const _RESOLVERS: BaseResolver[] = [
  new FontMiscResolver(),
  new FontResolver(),
  new AlignmentResolver(),
  new ObjectStrokeResolver(),
  new ObjectShadowResolver()
];

export const TEXT_RESOLVERS: BaseResolver[] = _RESOLVERS.filter(r => r.resolverType === ResolverType.TEXT);
export const OBJECT_RESOLVERS: BaseResolver[] = _RESOLVERS.filter(r => r.resolverType === ResolverType.OBJECT);
