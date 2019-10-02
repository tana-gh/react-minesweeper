import WebFont from 'webfontloader'

document.addEventListener('DOMContentLoaded', () => {
    WebFont.load({
        google: {
            families: [
                'Noto Sans',
                'Noto Sans JP'
            ]
        }
    })
})
