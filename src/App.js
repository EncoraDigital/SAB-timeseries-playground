// Components
import MainHeader from './components/MainHeader/MainHeader';
import MainContent from './components/MainContent/MainContent';
import TextDescription from './components/TextDescription/TextDescription';
import MainFooter from './components/MainFooter/MainFooter';

const App = {
  render() {
    return (
            <div class="wrapper">
                <MainHeader/>
                <MainContent/>
                <TextDescription/>
                <MainFooter/>
            </div>
    );
  },
};
export default App;
