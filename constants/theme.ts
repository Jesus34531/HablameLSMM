// theme.ts — importa esto en todos tus componentes

export const theme = {
  colors: {
    // Fondos
    background:     '#FFF8F0',   // crema cálido (reemplaza #070d1a)
    surface:        '#FFFFFF',   // tarjetas blancas
    surfaceAlt:     '#F0F4FF',   // tarjetas secundarias (azul muy suave)

    // Texto (alto contraste sobre fondo claro)
    textPrimary:    '#2D2D2D',   // reemplaza #f1f5f9
    textSecondary:  '#555555',   // reemplaza #94a3b8
    textMuted:      '#888888',   // reemplaza #475569

    // Colores de acento por nivel (pasteles vivos, no neón)
    level1:         '#FF7043',   // coral (reemplaza #f97316)
    level2:         '#AB47BC',   // violeta (reemplaza #a855f7)
    level3:         '#00ACC1',   // turquesa (reemplaza #06b6d4)
    level4:         '#43A047',   // verde (reemplaza #22c55e)
    level5:         '#FFA726',   // ámbar (reemplaza #f59e0b)

    // UI
    border:         'rgba(0,0,0,0.12)',
    success:        '#43A047',
    white:          '#FFFFFF',
  },

  typography: {
    // Familia — ver Paso 2 para instalar Nunito
    fontFamily: 'Nunito_700Bold', // para títulos
    fontFamilyRegular: 'Nunito_400Regular',
    fontFamilySemiBold: 'Nunito_600SemiBold',

    // Tamaños (más grandes que tu versión actual)
    xs:   13,
    sm:   15,
    base: 17,
    lg:   20,
    xl:   24,
    xxl:  30,
  },

  spacing: {
    xs: 6, sm: 10, md: 16, lg: 22, xl: 32,
  },

  radius: {
    sm: 10, md: 16, lg: 22, pill: 50,
  },
};