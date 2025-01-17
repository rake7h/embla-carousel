import { ActionReturn } from 'svelte/action'
import { arePluginsEqual, canUseDOM } from './utils'
import EmblaCarousel, {
  EmblaCarouselType,
  EmblaOptionsType,
  EmblaPluginType,
} from 'embla-carousel'

type EmblaCarouselParameterType = {
  options: EmblaOptionsType
  plugins: EmblaPluginType[]
}

export type EmblaCarouselSvelteType = ActionReturn<EmblaCarouselParameterType>

function emblaCarouselSvelte(
  emblaNode: HTMLElement,
  emblaConfig: EmblaCarouselParameterType = { options: {}, plugins: [] },
): EmblaCarouselSvelteType {
  const areOptionsEqual = EmblaCarousel.optionsHandler().areEqual
  let storedEmblaConfig = emblaConfig
  let embla: EmblaCarouselType

  if (canUseDOM()) {
    EmblaCarousel.globalOptions = emblaCarouselSvelte.globalOptions
    embla = EmblaCarousel(
      emblaNode,
      storedEmblaConfig.options,
      storedEmblaConfig.plugins,
    )
    embla.on('init', () =>
      emblaNode.dispatchEvent(new CustomEvent('init', { detail: embla })),
    )
  }

  return {
    destroy: () => {
      if (embla) embla.destroy()
    },
    update: (newEmblaConfig) => {
      const optionsChanged = !areOptionsEqual(
        storedEmblaConfig.options,
        newEmblaConfig.options,
      )
      const pluginsChanged = !arePluginsEqual(
        storedEmblaConfig.plugins,
        newEmblaConfig.plugins,
      )

      if (!optionsChanged && !pluginsChanged) return
      storedEmblaConfig = newEmblaConfig

      if (embla) {
        embla.reInit(storedEmblaConfig.options, storedEmblaConfig.plugins)
      }
    },
  }
}

emblaCarouselSvelte.globalOptions = <EmblaOptionsType | undefined>undefined

export default emblaCarouselSvelte
