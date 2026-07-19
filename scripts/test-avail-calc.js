const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const { addDays, format, startOfDay } = require('date-fns')

function generateTimeSlots(startTime, endTime, durationMinutes) {
  const slots = []
  const [startHour, startMin] = startTime.split(':').map(Number)
  const [endHour, endMin] = endTime.split(':').map(Number)

  let current = startHour * 60 + startMin
  const end = endHour * 60 + endMin

  while (current <= end) {
    const h = Math.floor(current / 60).toString().padStart(2, '0')
    const m = (current % 60).toString().padStart(2, '0')
    slots.push(`${h}:${m}`)
    current += durationMinutes
  }
  return slots
}

async function main() {
  const therapistId = 'cmqmqp8xj0001x8xubrrhmrzx' // Lara Munique Profile ID
  const profile = await prisma.therapistProfile.findUnique({
    where: { id: therapistId },
    include: {
      availability: true,
      appointments: {
        where: {
          status: { in: ['PENDENTE', 'CONFIRMADO'] },
          date: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
        },
      }
    }
  })

  if (!profile) {
    console.log('Profile not found!')
    return
  }

  console.log(`Therapist: ${profile.professionalName}`)
  console.log(`Availability rules count: ${profile.availability.length}`)
  console.log(`Appointments count: ${profile.appointments.length}`)

  const weekStart = startOfDay(new Date())
  const daysInView = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  const durationMinutes = 60 // Default fallback duration

  daysInView.forEach(date => {
    const isoDate = format(date, 'yyyy-MM-dd')
    const dayOfWeek = date.getDay()

    let allSlots = []

    const specificAvail = profile.availability.filter(a => a.date && format(new Date(a.date), 'yyyy-MM-dd') === isoDate)
    
    if (specificAvail.length > 0) {
      const activeSpecific = specificAvail.filter(a => a.active)
      activeSpecific.forEach(avail => {
        allSlots.push(...generateTimeSlots(avail.startTime, avail.endTime, 30))
      })
      console.log(`Date: ${isoDate} (Day: ${dayOfWeek}) - Specific Avail found: ${specificAvail.length}`)
    } else {
      const weeklyAvail = profile.availability.filter(a => a.dayOfWeek === dayOfWeek && !a.date && a.active)
      weeklyAvail.forEach(avail => {
        allSlots.push(...generateTimeSlots(avail.startTime, avail.endTime, 30))
      })
      console.log(`Date: ${isoDate} (Day: ${dayOfWeek}) - Weekly Avail found: ${weeklyAvail.length} slots`)
    }

    let uniqueSlots = Array.from(new Set(allSlots)).sort()

    // Filter conflicts
    const dayAppointments = profile.appointments.filter(apt => {
      return format(new Date(apt.date), 'yyyy-MM-dd') === isoDate
    })

    if (dayAppointments.length > 0 && uniqueSlots.length > 0) {
      uniqueSlots = uniqueSlots.filter(slotTime => {
        const [h, m] = slotTime.split(':').map(Number)
        const candidateDate = new Date(date)
        candidateDate.setHours(h, m, 0, 0)
        const candidateStartMs = candidateDate.getTime()
        const candidateEndMs = candidateStartMs + durationMinutes * 60 * 1000

        const hasConflict = dayAppointments.some(apt => {
          const bookedStartMs = new Date(apt.date).getTime()
          const bookedEndMs = bookedStartMs + apt.durationMinutes * 60 * 1000
          return candidateStartMs < bookedEndMs && bookedStartMs < candidateEndMs
        })

        return !hasConflict
      })
    }

    // Filter past times for today
    const isToday = date.toDateString() === new Date().toDateString()
    if (isToday) {
      const now = new Date()
      const currentHourStr = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0')
      console.log(`  Today filter active. Current time: ${currentHourStr}`)
      console.log(`  Slots before filtering: ${uniqueSlots.slice(0, 5).join(', ')}... (Total: ${uniqueSlots.length})`)
      uniqueSlots = uniqueSlots.filter(slot => slot > currentHourStr)
      console.log(`  Slots after filtering: ${uniqueSlots.slice(0, 5).join(', ')}... (Total: ${uniqueSlots.length})`)
    }

    console.log(`  Final Available Slots count: ${uniqueSlots.length}`)
  })
}

main().catch(console.error).finally(() => prisma.$disconnect())
