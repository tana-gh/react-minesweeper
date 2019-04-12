import * as React    from 'react'
import * as ReactDOM from 'react-dom'
import '@/utils/font'
import '@/stylus/style.styl'

class App extends React.Component {
    render() {
        return <h1>Hello, world!</h1>
    }
}

ReactDOM.render(<App/>, document.getElementById('root'))
