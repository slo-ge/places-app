import {BaseResolver, ResolverType} from "@app/core/editor/resolvers/base.resolver";
import {AlignmentResolver} from "@app/core/editor/resolvers/alignment.resolver";
import {FontResolver, FontMiscResolver} from "@app/core/editor/resolvers/font.resolver";

export const _RESOLVERS: BaseResolver[] = [
  new FontMiscResolver(),
  new FontResolver(),
  new AlignmentResolver()
];

export const TEXT_RESOLVERS: BaseResolver[] = _RESOLVERS.filter(r => r.resolverType === ResolverType.TEXT);
