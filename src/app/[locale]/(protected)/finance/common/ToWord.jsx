import { toWords } from 'number-to-words';


function ToWord({ num }) {
    const nums = num.toString().split('.')
    const whole = toWords(nums[0])
    if (nums.length == 2) {
        var fraction = toWords(nums[1])
        return whole + ' and ' + fraction;
    } else 
        return whole;
}

export default ToWord
