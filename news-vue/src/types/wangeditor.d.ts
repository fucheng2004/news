declare module '@wangeditor/editor-for-vue' {
  import { Component } from 'vue'
  
  export const Editor: Component
  export const Toolbar: Component
}

declare module '@wangeditor/editor' {
  interface IEditorConfig {
    placeholder?: string
    readOnly?: boolean
    autoFocus?: boolean
    scroll?: boolean
    [key: string]: any
  }
  
  interface IToolbarConfig {
    toolbarKeys?: string[]
    [key: string]: any
  }
  
  interface IDomEditor {
    getHtml: () => string
    getText: () => string
    setHtml: (html: string) => void
    clear: () => void
    destroy: () => void
    insertText: (text: string) => void
    [key: string]: any
  }
  
  export type { IEditorConfig, IToolbarConfig, IDomEditor }
} 