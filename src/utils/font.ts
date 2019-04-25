import WebFont from 'webfontloader'

window.addEventListener('load', () => {
    WebFont.load({
        google: {
            families: [
                'Noto Sans',
                'Noto Sans JP'
            ]
        }
    })
})
