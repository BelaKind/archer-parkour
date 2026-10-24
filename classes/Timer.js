class Timer {
    constructor() {
        this.elapsed_time = 0
        this.start_time = 0
    }

    calculate_time(interval) {
        this.elapsedTime = performance.now()
        if(this.elapsedTime - this.startTime > interval) {
            this.startTime = this.elapsedTime
            return true
        }else{
            return false
        } 
    }
}