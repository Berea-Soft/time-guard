export interface CodeExample {
  title: string;
  description: string;
  code: string;
}

export interface DocItem {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  features?: string[];
  examples: CodeExample[];
  /** Slug del demo en vivo relacionado en /demos/:slug (opcional). */
  demoComponentId?: string;
}

export interface DocCategory {
  id: string;
  title: string;
  iconName: string;
  items: DocItem[];
}
