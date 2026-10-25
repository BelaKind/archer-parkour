class Timer {
    constructor() {
        this.elapsed_time = 0
        this.start_time = performance.now()
    }

    calculate_time(interval) {
        this.elapsed_time = performance.now()
        if(this.elapsed_time - this.start_time > interval) {
            this.start_time = this.elapsed_time
            return true
        }else{
            return false
        } 
    }
}