import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import NavHeader from '@/components/layout/NavHeader.vue'
import { createPinia } from 'pinia'

describe('NavHeader', () => {
  it('renders properly', () => {
    const wrapper = mount(NavHeader, {
      global: {
        plugins: [createPinia()]
      }
    })
    expect(wrapper.find('.nav-header').exists()).toBe(true)
    expect(wrapper.find('.logo h1').text()).toBe('新闻真实性检测平台')
  })

  it('shows login button when not authenticated', () => {
    const wrapper = mount(NavHeader, {
      global: {
        plugins: [createPinia()]
      }
    })
    expect(wrapper.find('button').text()).toBe('登录')
  })
}) 