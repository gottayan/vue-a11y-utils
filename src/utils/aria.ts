type AriaRole = string
type AriaProps = AriaRealProps | AriaRealProps[]
type AriaRealProps = Record<string, string | number | boolean | string[] | undefined>
type AriaAttrs = Record<string, string>

export const getAriaAttrs = (role: AriaRole = '', props: AriaProps, tabindex?: number): AriaAttrs => {
  const attrs: AriaAttrs = {}

  if (role) {
    attrs.role = role
  }
  mergeTabindexToAttrs(tabindex, attrs)
  mergeAriaPropsToAttrs(props, attrs)

  return attrs
}

// merging functions

function mergeTabindexToAttrs(tabindex: number | undefined, attrs: AriaAttrs): void {
  const isAppearance: boolean = attrs.role === 'none' || attrs.role === 'appearance';
  if (isAppearance || typeof tabindex === 'undefined' || isNaN(tabindex)) {
    return
  }
  attrs.tabindex = tabindex.toString();
}

function mergeAriaPropsToAttrs(props: AriaProps, attrs: AriaAttrs): void {
  const flatAria = flattenAriaProps(props);
  for (const name in flatAria) {
    const value = flatAria[name];
    if (typeof value !== 'undefined' && value !== null) {
      if (Array.isArray(value)) {
        attrs[`aria-${name}`] = value.join(' ');
      } else {
        attrs[`aria-${name}`] = value.toString();
      }
    }
  }
}

function flattenAriaProps(props: AriaProps): AriaRealProps {
  const result = {};
  if (props) {
    if (Array.isArray(props)) {
      props.forEach(propsItem => {
        Object.assign(result, propsItem);
      });
    } else {
      Object.assign(result, props);
    }
  }
  return result;
}
