export interface CompletenessResult {
  status: 'Completo' | 'Parcialmente Completo' | 'Incompleto'
  indicator: 'none' | 'laranja' | 'vermelho'
  missingMandatory: { field: string; label: string }[]
  missingOptional: { field: string; label: string }[]
  mandatoryCount: number
  optionalCount: number
}

function isEmpty(val: any): boolean {
  if (val === null || val === undefined) return true
  if (typeof val === 'string') return val.trim() === ''
  if (Array.isArray(val)) return val.length === 0
  if (typeof val === 'number') return isNaN(val)
  return false
}

export function getProfileCompleteness(user: any): CompletenessResult {
  const missingMandatory: { field: string; label: string }[] = []
  const missingOptional: { field: string; label: string }[] = []

  let mandatoryCount = 0
  let optionalCount = 0

  if (!user) {
    return {
      status: 'Incompleto',
      indicator: 'vermelho',
      missingMandatory: [],
      missingOptional: [],
      mandatoryCount: 0,
      optionalCount: 0,
    }
  }

  const role = user.role

  // 1. ADMIN
  if (role === 'ADMIN') {
    return {
      status: 'Completo',
      indicator: 'none',
      missingMandatory: [],
      missingOptional: [],
      mandatoryCount: 0,
      optionalCount: 0,
    }
  }

  // 2. PACIENTE
  else if (role === 'PACIENTE') {
    const pp = user.patientProfile || {}

    // Obrigatórios (17 campos)
    mandatoryCount += 17
    if (isEmpty(user.name)) missingMandatory.push({ field: 'name', label: 'Nome' })
    if (isEmpty(user.email)) missingMandatory.push({ field: 'email', label: 'E-mail' })
    if (isEmpty(user.phone)) missingMandatory.push({ field: 'phone', label: 'Telefone' })
    
    // Data de nascimento do paciente pode estar no User ou no PatientProfile
    const birthDate = user.birthDate || pp.birthDate
    if (isEmpty(birthDate)) missingMandatory.push({ field: 'birthDate', label: 'Data de Nascimento' })

    // Profissão
    if (isEmpty(pp.profession)) missingMandatory.push({ field: 'profession', label: 'Profissão' })

    // Endereço obrigatório
    if (isEmpty(pp.zipCode)) missingMandatory.push({ field: 'zipCode', label: 'CEP' })
    if (isEmpty(pp.street)) missingMandatory.push({ field: 'street', label: 'Logradouro' })
    if (isEmpty(pp.number)) missingMandatory.push({ field: 'number', label: 'Número' })
    if (isEmpty(pp.neighborhood)) missingMandatory.push({ field: 'neighborhood', label: 'Bairro' })
    if (isEmpty(pp.city)) missingMandatory.push({ field: 'city', label: 'Cidade' })
    if (isEmpty(pp.state)) missingMandatory.push({ field: 'state', label: 'UF / Região' })
    if (isEmpty(pp.country)) missingMandatory.push({ field: 'country', label: 'País' })

    // Anamnese obrigatória
    const anamnese = pp.anamnese || {}
    if (isEmpty(anamnese.objetivo)) missingMandatory.push({ field: 'anamnese.objetivo', label: 'Objetivo Terapêutico' })
    if (isEmpty(anamnese.historicoEmocional)) missingMandatory.push({ field: 'anamnese.historicoEmocional', label: 'Histórico Emocional' })
    if (isEmpty(anamnese.medicamentos)) missingMandatory.push({ field: 'anamnese.medicamentos', label: 'Uso de Medicamentos' })
    if (isEmpty(anamnese.alergias)) missingMandatory.push({ field: 'anamnese.alergias', label: 'Alergias/Restrições' })
    if (isEmpty(anamnese.expectativas)) missingMandatory.push({ field: 'anamnese.expectativas', label: 'Expectativas' })

    // Opcionais (4 campos)
    optionalCount += 4
    if (isEmpty(pp.socialName)) missingOptional.push({ field: 'socialName', label: 'Nome Social' })
    if (isEmpty(pp.gender)) missingOptional.push({ field: 'gender', label: 'Gênero' })
    if (isEmpty(pp.maritalStatus)) missingOptional.push({ field: 'maritalStatus', label: 'Estado Civil' })
    if (isEmpty(pp.complement)) missingOptional.push({ field: 'complement', label: 'Complemento' })
  }

  // 3. TERAPEUTA
  else if (role === 'TERAPEUTA') {
    const tp = user.therapistProfile || {}

    // Obrigatórios
    mandatoryCount += 10
    if (isEmpty(user.name)) missingMandatory.push({ field: 'name', label: 'Nome' })
    if (isEmpty(user.birthDate)) missingMandatory.push({ field: 'birthDate', label: 'Data de Nascimento' })
    if (isEmpty(tp.professionalName)) missingMandatory.push({ field: 'professionalName', label: 'Nome Profissional' })
    if (isEmpty(tp.country)) missingMandatory.push({ field: 'country', label: 'País' })
    if (isEmpty(tp.state)) missingMandatory.push({ field: 'state', label: 'Estado (UF)' })
    
    const phoneNum = user.phone || tp.whatsapp
    if (isEmpty(phoneNum)) missingMandatory.push({ field: 'whatsapp', label: 'WhatsApp / Telefone' })
    
    if (isEmpty(tp.professionalEmail)) missingMandatory.push({ field: 'professionalEmail', label: 'E-mail Profissional' })
    if (isEmpty(tp.modality)) missingMandatory.push({ field: 'modality', label: 'Modalidade de Atendimento' })
    if (isEmpty(tp.bio)) missingMandatory.push({ field: 'bio', label: 'Biografia/Descrição' })
    if (isEmpty(tp.documentUrl)) missingMandatory.push({ field: 'documentUrl', label: 'Comprovante de Identidade' })

    // Opcionais
    optionalCount += 8
    if (isEmpty(tp.city)) missingOptional.push({ field: 'city', label: 'Cidade' })
    if (isEmpty(tp.nationality)) missingOptional.push({ field: 'nationality', label: 'Nacionalidade' })
    if (isEmpty(tp.languages)) missingOptional.push({ field: 'languages', label: 'Idiomas' })
    
    const priceNum = Number(tp.price)
    if (isEmpty(priceNum) || priceNum <= 0) missingOptional.push({ field: 'price', label: 'Valor da Sessão' })
    
    if (isEmpty(tp.instagram)) missingOptional.push({ field: 'instagram', label: 'Instagram' })
    if (isEmpty(tp.facebook)) missingOptional.push({ field: 'facebook', label: 'Facebook' })
    if (isEmpty(tp.websiteUrl)) missingOptional.push({ field: 'websiteUrl', label: 'Site Pessoal' })
    if (isEmpty(tp.presentationVideoUrl)) missingOptional.push({ field: 'presentationVideoUrl', label: 'Vídeo de Apresentação' })

    // Se modalidade for PRESENCIAL ou AMBOS, os campos de endereço físico tornam-se obrigatórios
    if (tp.modality === 'PRESENCIAL' || tp.modality === 'AMBOS') {
      let cep = ''
      let street = ''
      let number = ''
      let neighborhood = ''
      
      if (tp.location && tp.location.includes(';;;')) {
        const parts = tp.location.split(';;;')
        cep = parts[0] || ''
        street = parts[1] || ''
        number = parts[2] || ''
        neighborhood = parts[3] || ''
      }

      mandatoryCount += 4
      if (isEmpty(cep)) missingMandatory.push({ field: 'address.cep', label: 'CEP do Consultório' })
      if (isEmpty(street)) missingMandatory.push({ field: 'address.street', label: 'Rua do Consultório' })
      if (isEmpty(number)) missingMandatory.push({ field: 'address.number', label: 'Número do Consultório' })
      if (isEmpty(neighborhood)) missingMandatory.push({ field: 'address.neighborhood', label: 'Bairro do Consultório' })
    }
  }

  // Lógica de status e indicadores
  let status: 'Completo' | 'Parcialmente Completo' | 'Incompleto' = 'Completo'
  let indicator: 'none' | 'laranja' | 'vermelho' = 'none'

  if (missingMandatory.length > 0) {
    status = 'Incompleto'
    indicator = 'vermelho'
  } else if (missingOptional.length > 0) {
    status = 'Parcialmente Completo'
    indicator = 'laranja'
  }

  return {
    status,
    indicator,
    missingMandatory,
    missingOptional,
    mandatoryCount,
    optionalCount,
  }
}
