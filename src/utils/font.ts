import WebFont from 'webfontloader'

window.onload = () => {
    WebFont.load({
        google: {
            families: [
                'Noto Sans',
                'Noto Sans JP'
            ]
        }
    })
}
