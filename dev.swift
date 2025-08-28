// Protocol

protocol Sharable: Encodable {
  var shareType: ShareObject { get }

  func getCustomListExercises() -> [ListExercise]

  func decode(_ str: String) throws -> Sharable
}

enum ShareObject: Codable {
  case split
  case workout
  case workoutLog
}

enum ShareError: Error {
  case invalidObject
  case invalidExercises
}

// Protocol Conformance

extension Split: Sharable {
  var shareType: { .split }

  func getCustomListExercises() -> [ListExercise] {
    return self.workouts.compactMap {
      switch $0 {
        case .rest: nil
        case .workout(let w): w.getCustomListExercises()
      }
    }
  }

  func decode(_ str: String) throws -> Sharable {
    guard let data = str.data(using: .utf8) else {
      throw ShareError.invalidObject
    }
    let decoder = JSONDecoder();
    decoder.dateDecodingStrategy = .iso8601
    return try decoder.decode(Split.self, from: data)
  }
}

extension Workout: Sharable {
  var shareType: { .workout }

  func getCustomListExercises() -> [ListExercise] {
    return self.exercises.flatMap { $0.getCustomListExercises() }
  }

  func decode(_ str: String) throws -> Sharable {
    guard let data = str.data(using: .utf8) else {
      throw ShareError.invalidObject
    }
    let decoder = JSONDecoder();
    decoder.dateDecodingStrategy = .iso8601
    return try decoder.decode(Workout.self, from: data)
  }
}

extension WorkoutLog: Sharable {
  var shareType: { .workoutLog }

  func getCustomListExercises() -> [ListExercise] {
    return self.exercises.flatMap { $0.getCustomListExercises() }
  }

  func decode(_ str: String) throws -> Sharable {
    guard let data = str.data(using: .utf8) else {
      throw ShareError.invalidObject
    }
    let decoder = JSONDecoder();
    decoder.dateDecodingStrategy = .iso8601
    return try decoder.decode(WorkoutLog.self, from: data)
  }
}

extension Array<MultiExerciseWrapper> {
  func getCustomListExercises() -> [ListExercise] {
    self.flatMap {
      $0.compactMap {
        switch $0 {
          case .cardio: nil
          case .weight(let w): return w.listId == "" ? nil : w
        }
      }
    }
  }
}

// Request

struct ShareRequest: Codable {
  ownerId: String
  sharedWith: [String]
  object: String
  listExercises: String
  type: String
}


func buildShareRequest(
  for object: Sharable,
  ownedBy: String,
  sharedWith: [String]
) throws -> ShareRequest {
  // initialize request
  var request = ShareRequest(
    ownerId: ownedBy,
    sharedWith: sharedWith,
    object: "",
    listExercises: "",
    type: object.shareType
  );

  // serialize object
  let encoder = JSONEncoder();
  encoder.dateEncodingStrategy = .iso8601
  let objectData = try encoder.encode(object);
  guard let objectStr = String(data: objectData, encoding: .utf8) else {
    throw ShareError.invalidObject
  }
  request.object = objectStr

  // serialize list exercises
  let exercises = object.getCustomListExercises();
  let exercisesData = try encoder.encode(exercises);
  guard let exercisesStr = String(data: exercisesData, encoding: .utf8) else {
    throw ShareError.invalidExercises
  }
  request.listExercises = exercisesStr

  return request
}

// Response

struct ShareResponse: Codable {
  let object: String
  let listExercises: String
  let type: ShareObject
}

func decodeShareResponse(
  _ response: ShareResponse
) throws -> (Sharable, [ListExercise]) {
  // decode object
  guard let objectData = response.object.data(using: .utf8) else {
    throw ShareError.invalidObject
  }
  let object = switch type {
    case .split: try Split.decode(objectData)
    case .workout: try Workout.decode(objectData)
    case .workoutLog: try WorkoutLog.decode(objectData)
  }

  // decode list exercises
  guard let listExercisesData = response.listExercises.data(using: .utf8) else {
    throw ShareError.invalidExercises
  }
  let listExercises = try JSONDecoder().decode([ListExercise].self, from: listExercisesData)

  return (object, listExercises)
}