import { BaseResolver, ResolverType } from "@app/core/editor/resolvers/base.resolver";
import { AlignmentResolver } from "@app/core/editor/resolvers/alignment.resolver";
import { FontMiscResolver, FontResolver } from "@app/core/editor/resolvers/font.resolver";
import { StrokeResolver } from '@app/core/editor/resolvers/stroke.resolver';

const _RESOLVERS: BaseResolver[] = [
  new FontMiscResolver(),
  new FontResolver(),
  new AlignmentResolver(),
  new StrokeResolver()
];

export const TEXT_RESOLVERS: BaseResolver[] = _RESOLVERS.filter(r => r.resolverType === ResolverType.TEXT);
// TODO: add object resolver
export const OBJECT_RESOLVERS: BaseResolver[] = _RESOLVERS.filter(r => r.resolverType === ResolverType.OBJECT);
