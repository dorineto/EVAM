import {createNumberMask} from 'react-native-mask-input';

export const QtdMask = createNumberMask({
    delimiter: '.',
    separator: ',',
    precision: 2,
});
