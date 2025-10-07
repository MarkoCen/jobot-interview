package graph

import (
	"sync"
	"time"
)

// PingData holds the last ping time. It includes an embedded mutex to
// allow safe concurrent reads/writes when used as a singleton.
type PingData struct {
	mu   sync.RWMutex
	// Time is a pointer so its zero-value is nil. That lets callers
	// distinguish "not set" from the zero time.
	Time *time.Time
}

// Get returns the Time pointer (safe for concurrent callers). It may be nil
// if the time has not been set yet.
func (d *PingData) Get() *time.Time {
	d.mu.RLock()
	t := d.Time
	d.mu.RUnlock()
	return t
}

// Set updates the Time value (safe for concurrent callers).
func (d *PingData) Set(t time.Time) {
	d.mu.Lock()
	d.Time = &t
	d.mu.Unlock()
}

var (
	pingOnce     sync.Once
	pingInstance *PingData
)

// Ping returns the package-level singleton PingData instance. It is
// initialized once on first call with the current UTC time.
func Ping() *PingData {
	pingOnce.Do(func() {
		// Leave Time nil initially; callers can Set() later.
		pingInstance = &PingData{}
	})
	return pingInstance
}

